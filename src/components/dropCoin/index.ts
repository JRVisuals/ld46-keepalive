import * as PIXI from 'pixi.js';
import gsap, { Power0, Bounce } from 'gsap';
import {
  GROUND_MOVE_SPEED,
  APP_HEIGHT,
  GROUND_TILE_WIDTH,
  GROUND_TILE_HEIGHT,
  GRAVITY_Y,
} from '../../constants';
import * as HERO from '../hero';
import { UiCoin } from '../uiCoin';

export interface DropCoin {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  spawnDrop: (props: { targetSprite: PIXI.Container }) => void;
}

interface ComponentProps {
  pos?: { x: number; y: number };
  hero: HERO.Hero;
  uiCoin: UiCoin;
}

/**
 * A coin dropped by the enemy mobs when killed.
 * The player will have to click the coins for The Hero to gain their value.
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const dropCoin = (props: ComponentProps): DropCoin => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'dropCoin container';

  const { hero, uiCoin } = props;

  let state = {
    activeCoins: [],
    yVel: 1,
    xVel: 0,
  };
  const initialState = { ...state };

  const texture = PIXI.Texture.from('./assets/dropCoin.png');

  // Called by the enemyManager
  const spawnDrop = ({ targetSprite }): void => {
    // Create a new coin sprite
    const coinSprite = new PIXI.Sprite(texture);
    coinSprite.anchor.set(0);
    coinSprite.x = Math.floor(targetSprite.x);
    coinSprite.y = Math.floor(targetSprite.y - 32);

    // Give it some random horizontal movement so all coins don't wind up in the same place
    const ranXVel = Math.random() * 10 + 5;

    // The coin object will maintain the coin's state as well as a reference to the sprite
    const coin = {
      state: { xVel: ranXVel, status: 'ON_SCREEN' },

      sprite: container.addChild(coinSprite),
    };

    // Make the coin clickable!
    coinSprite.interactive = true;
    coinSprite
      .on('mousedown', () => {
        coinClicked(coin);
      })
      .on('touchstart', () => {
        coinClicked(coin);
      });

    // Keep track of all active coins
    state.activeCoins.push(coin);

    // Cheap bounce animation
    gsap.to(coinSprite, 0.75, {
      y: APP_HEIGHT - GROUND_TILE_HEIGHT - 15,
      ease: Bounce.easeOut,
    });
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
  };
  reset();

  // remove this coin from the active coins list
  const removeCoin = (coin): void => {
    state.activeCoins.forEach((aCoin, i) => {
      // Remove enemy from array
      if (coin.sprite === aCoin.sprite) state.activeCoins.splice(i, 1);
    });
    // destroy sprite
    container.removeChild(coin.sprite);
  };

  // Coin exited screen, remove it.
  const exitedScreen = (coin): void => {
    coin.state.status = 'OFF_SCREEN';
    removeCoin(coin);
  };

  // Move the coin according to the world
  const updateCoinPositions = (): void => {
    state.activeCoins.forEach((coin) => {
      // Bail if this coin isn't on screen
      if (coin.state.status != 'ON_SCREEN') return;

      coin.state.xVel = coin.state.xVel * 0.95;
      if (coin.state.xVel < 0) {
        coin.state.xVel = 0;
      }
      const nextX = coin.sprite.x - GROUND_MOVE_SPEED + coin.state.xVel;
      if (nextX < -GROUND_TILE_WIDTH) exitedScreen(coin);
      coin.sprite.x = nextX;
    });
  };

  const coinClicked = (coin): void => {
    console.log('clicked', coin);
    if (coin.state.status != 'ON_SCREEN') return;
    coin.state.status = 'ANIMATING_OUT';

    const targetY = coin.sprite.y - 64;
    gsap.to(coin.sprite, 0.25, {
      x: uiCoin.container.x,
      y: uiCoin.container.y,
      alpha: 0,
      ease: Power0.easeOut,
      onComplete: () => {
        coin.state.status = 'OFF_SCREEN';
        hero.getCoin();
        removeCoin(coin);
      },
    });
  };

  const update = (delta): void => {
    // Update called by main
    state.activeCoins.length > 0 && updateCoinPositions();
  };

  return { container, reset, update, spawnDrop };
};
