import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';
import {
  GROUND_MOVE_SPEED,
  APP_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  ENEMY_FRAMES,
} from '../../constants';

export interface Enemy {
  container: PIXI.Container;
  update: (delta: number) => void;
  gotKilled: () => void;
  getStatus: () => string;
}

interface Props {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
  destroyManagerInstance: (enemy: PIXI.Sprite | PIXI.Container) => void;
}

export const enemy = (props: Props): Enemy => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const yGrav = 0.3;

  const enemyState = {
    status: 'ON_SCREEN',
    yVel: 0,
  };

  const { destroyManagerInstance } = props;

  // Old school spritesheet
  const liveFrames = [];
  for (let i = 1; i <= ENEMY_FRAMES; i++) {
    liveFrames.push(PIXI.Texture.from(`./assets/enemy_cube${i}.png`));
  }
  const liveAnim = new PIXI.AnimatedSprite(liveFrames);
  liveAnim.animationSpeed = 0.09;
  liveAnim.anchor.set(0.5);
  container.addChild(liveAnim);
  liveAnim.gotoAndPlay(0);

  const deathFrames = [];
  for (let i = 5; i <= 9; i++) {
    deathFrames.push(PIXI.Texture.from(`./assets/enemy_cube${i}.png`));
  }
  const deathAnim = new PIXI.AnimatedSprite(deathFrames);
  deathAnim.animationSpeed = 0.17;
  deathAnim.anchor.set(0.5);

  const getStatus = (): string => {
    return enemyState.status;
  };

  const exitedScreen = (): void => {
    // Let the manager handle this...
    destroyManagerInstance(container);
    // Just in case...
    // sprite.destroy();
    // And even more just in case...
    enemyState.status = 'OFF_SCREEN';
    // You know how thos managers can be. XD
  };

  const moveTowardHero = (): void => {
    const movementSpeed =
      enemyState.status === 'DYING' || enemyState.status === 'DEAD'
        ? GROUND_MOVE_SPEED
        : GROUND_MOVE_SPEED * 1.1;
    const nextX = container.x - movementSpeed;
    if (nextX < -TILE_WIDTH) exitedScreen();
    container.x = nextX;
  };

  const gotKilled = (): void => {
    if (enemyState.status === 'DYING') return;
    container.x += 10;
    enemyState.status = 'DYING';
    enemyState.yVel = -5;

    container.removeChild(liveAnim);
    container.addChild(deathAnim);
    deathAnim.gotoAndPlay(0);
  };

  // Not used
  const moveToDeath = (): void => {
    enemyState.yVel =
      enemyState.yVel > GROUND_MOVE_SPEED * 1.5
        ? GROUND_MOVE_SPEED * 1.5
        : enemyState.yVel + yGrav;

    const nextY = container.y + enemyState.yVel;
    if (nextY > APP_HEIGHT + TILE_HEIGHT) exitedScreen();
    container.y = nextY;
    container.rotation += 0.1;
  };

  const checkDeathFrame = (): void => {
    if (deathAnim.currentFrame === 4) {
      deathAnim.stop();
      enemyState.status = 'DEAD';
      // gsap.to(deathAnim, 0.2, {
      //   alpha: 0,
      //   ease: Power0.easeOut,
      //   onComplete: () => {
      //     exitedScreen();
      //   },
      // });
    }
  };

  const update = (): void => {
    // Update called by main
    switch (enemyState.status) {
      case 'OFF_SCREEN':
        return;
        break;
      case 'ON_SCREEN':
      case 'DEAD':
        moveTowardHero();
        break;
      case 'DYING':
        //moveToDeath();
        //moveTowardHero();
        checkDeathFrame();
        break;
    }
  };

  return { container, update, gotKilled, getStatus };
};
