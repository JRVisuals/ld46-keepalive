import * as PIXI from 'pixi.js';
import * as PIXISOUND from 'pixi-sound';

import {
  ENEMY_DPH,
  GROUND_MOVE_SPEED,
  GRAVITY_Y,
  APP_HEIGHT,
  TILE_HEIGHT,
  TILE_WIDTH,
  POTION_HEAL,
} from '../../constants';
import { Coin } from '../coin';
import { HeroNumbers } from '../heroNumbers';

export interface Hero {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  getCurrentFrame: () => number;
  gotHit: () => void;
  getCoin: () => void;
  doAttack: () => void;
  getStatus: () => string;
  buyPotion: () => void;
}

interface Props {
  pos?: { x: number; y: number };
  heroNubmers: HeroNumbers;
  hpDisplay: (hp: number) => void;
  coinDisplay: Coin;
  onHeroDied: () => void;
}

export const hero = (props: Props): Hero => {
  const HERO_FRAMES = 4;
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();

  const { heroNubmers, hpDisplay, coinDisplay, onHeroDied } = props;

  let state = {
    hp: 100,
    xOrrig: 0 - TILE_WIDTH,
    yOrrig: pos.y,
    yVel: 0,
    xVel: GROUND_MOVE_SPEED * 0.5,
    status: 'SPAWNING',
  };

  const initialState = { ...state };

  // Old school spritesheet
  const frames = [];
  for (let i = 1; i <= HERO_FRAMES; i++) {
    frames.push(PIXI.Texture.from(`../../assets/hero${i}.png`));
  }
  const anim = new PIXI.AnimatedSprite(frames);
  anim.animationSpeed = 0.12;
  anim.gotoAndPlay(0);
  anim.anchor.set(0.5);
  container.addChild(anim);

  // Sound bits
  const pixiSound = PIXISOUND.default;
  // Load these up on startup...
  pixiSound.add('scream', '../../assets/wilhelm.mp3');
  pixiSound.add('gotHit', '../../assets/gotHit1.mp3');
  pixiSound.add('attack', '../../assets/attack1.mp3');
  pixiSound.add('quaf', '../../assets/quaf.mp3');
  pixiSound.add('quafquick', '../../assets/quaf-short.mp3');

  const updateHpDisplay = (): void => {
    console.log(`now hero has ${state.hp}HP`);
    hpDisplay(state.hp / 100);
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    console.log('The Hero Reset');
    state = { ...initialState };
    container.x = state.xOrrig;
    container.y = state.yOrrig;
    container.rotation = 0;
    updateHpDisplay();
    anim.gotoAndPlay(0);
  };
  reset();

  const doAttack = (): void => {
    console.log('doAttack');
    pixiSound.play('attack', { loop: false, volume: 1 });
  };
  const getDead = (): void => {
    if (state.status === 'DYING') return;
    console.log(' get dead ');
    anim.gotoAndStop(1);
    state.status = 'DYING';
    state.yVel = -6;
    pixiSound.play('scream', { loop: false, volume: 1 });
    onHeroDied();
  };

  const getCurrentFrame = (): number => anim.currentFrame;

  const buyPotion = (): void => {
    if (state.status != 'ON_SCREEN') return;
    const { goodPurchase } = coinDisplay.subtractCoin();
    // Make sure we can affor this
    if (!goodPurchase) return;
    // play uncorking sound
    pixiSound.stop('quaf');
    pixiSound.stop('quafquick');
    Math.random() > 0.75
      ? pixiSound.play('quaf', { loop: false, volume: 1 })
      : pixiSound.play('quafquick', { loop: false, volume: 1 });

    // put this healing sequence elsewhere
    const newHp = state.hp + POTION_HEAL <= 100 ? state.hp + POTION_HEAL : 100;
    state.hp = newHp;
    heroNubmers.animateNumbers({ damageDone: POTION_HEAL, isHealing: true });
    updateHpDisplay();
  };
  const getStatus = (): string => {
    return state.status;
  };
  const getCoin = (): void => {
    coinDisplay.addCoin();
  };

  const gotHit = (): void => {
    if (state.status !== 'ON_SCREEN') return;
    pixiSound.play('gotHit', { loop: false, volume: 0.5 });
    state.status = 'RECOVERING';
    state.yVel = -2 * Math.random() * 2 - 1;
    state.xVel = -2 * Math.random() * 3 - 2;
    const damageDone = ENEMY_DPH; // buffs to take effect here
    const newHp = state.hp - ENEMY_DPH >= 0 ? state.hp - damageDone : 0;
    state.hp = newHp;
    heroNubmers.animateNumbers({ damageDone, isHealing: false });
    updateHpDisplay();
    if (newHp === 0) getDead();
  };

  const exitedScreen = (): void => {
    state.status = 'OFF_SCREEN';
    console.log('cleanup');
  };

  const moveToGround = (): void => {
    if (state.yVel === 0) return;
    state.yVel =
      state.yVel > GROUND_MOVE_SPEED * 1.5
        ? GROUND_MOVE_SPEED * 1.5
        : state.yVel + GRAVITY_Y;

    let nextY = container.y + state.yVel;
    if (nextY >= pos.y) {
      nextY = pos.y;
      state.yVel = 0;
    }
    container.y = nextY;
  };
  const moveToHome = (): void => {
    if (state.xVel === 0) return;
    state.xVel =
      state.xVel > GROUND_MOVE_SPEED * 1.5
        ? GROUND_MOVE_SPEED * 1.5
        : state.xVel + GRAVITY_Y;

    let nextX = container.x + state.xVel;
    if (nextX >= pos.x) {
      nextX = pos.x;
      state.xVel = 0;
      state.status = 'ON_SCREEN';
    }
    container.x = nextX;
  };
  const spawnToHome = (): void => {
    if (state.status !== 'SPAWNING') return;
    console.log('spawning');
    let nextX = container.x + state.xVel;
    if (nextX >= pos.x) {
      nextX = pos.x;
      state.xVel = 0;
      state.status = 'ON_SCREEN';
    }
    container.x = nextX;
  };

  const moveToDeath = (): void => {
    state.yVel =
      state.yVel > GROUND_MOVE_SPEED * 1.5
        ? GROUND_MOVE_SPEED * 1.5
        : state.yVel + GRAVITY_Y;

    const nextY = container.y + state.yVel;
    if (nextY > APP_HEIGHT + TILE_HEIGHT) exitedScreen();
    container.y = nextY;
    container.rotation -= 0.1;
  };

  const update = (delta): void => {
    // Update called by main
    switch (state.status) {
      case 'OFF_SCREEN':
        break;
      case 'ON_SCREEN':
        moveToGround();
      case 'SPAWNING':
        spawnToHome();
        break;
      case 'RECOVERING':
        moveToGround();
        moveToHome();
        break;
      case 'DYING':
        moveToDeath();
        break;
    }
  };

  return {
    container,
    reset,
    update,
    getCurrentFrame,
    gotHit,
    getCoin,
    doAttack,
    getStatus,
    buyPotion,
  };
};
