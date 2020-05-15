import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';
import {
  GROUND_MOVE_SPEED,
  APP_HEIGHT,
  GROUND_TILE_WIDTH,
  GROUND_TILE_HEIGHT,
} from '../../constants';

import { WaveEnemy } from './waves';

export interface Enemy {
  container: PIXI.Container;
  update: (delta: number) => void;
  gotKilled: () => void;
  getStatus: () => string;
  getDps: () => number;
  getCoinsDropped: () => number;
}

interface EnemyProps {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
  anims: { [key: string]: Array<PIXI.Texture> };
  data: WaveEnemy;
  destroyManagerInstance: (enemy: PIXI.Sprite | PIXI.Container) => void;
}

/**
 * A single enemy type (Gelatinous Cube). Handles animation and state for a single enemy.
 *
 * @param props - Standard component properties. **Plus** A callback to destroy the enemy manager when needed
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const enemy = (props: EnemyProps): Enemy => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'enemy';

  const {
    anims,
    data: { enemyTextureKey },
    data: { enemySpeed },
    data: { enemyDps },
    data: { coinsDropped },
    destroyManagerInstance,
  } = props;

  const yGrav = 0.3;

  const enemyState = {
    status: 'ON_SCREEN',
    yVel: 0,
  };

  /**
   * Getter for number of coins dropped by the enemy
   *
   * @returns coins dropped
   *
   */
  const getCoinsDropped = (): number => coinsDropped;

  /**
   * Getter for enemy damage number
   *
   * @returns the amount of damage the enemy does per hit
   *
   */
  const getDps = (): number => enemyDps;

  const animWalk = new PIXI.AnimatedSprite(
    anims[`enemy${enemyTextureKey}Walk`]
  );
  animWalk.animationSpeed = 0.08 * enemySpeed;
  animWalk.anchor.set(0.5);
  container.addChild(animWalk);
  animWalk.gotoAndPlay(0);

  const animDie = new PIXI.AnimatedSprite(anims[`enemy${enemyTextureKey}Die`]);
  animDie.animationSpeed = 0.17;
  animDie.anchor.set(0.5);

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
        : GROUND_MOVE_SPEED * enemySpeed;
    const nextX = container.x - movementSpeed;
    if (nextX < -GROUND_TILE_WIDTH) exitedScreen();
    container.x = nextX;
  };

  const gotKilled = (): void => {
    if (enemyState.status === 'DYING') return;
    container.x += 10;
    enemyState.status = 'DYING';
    enemyState.yVel = -5;

    container.removeChild(animWalk);
    container.addChild(animDie);
    animDie.gotoAndPlay(0);
  };

  // Not used
  const moveToDeath = (): void => {
    enemyState.yVel =
      enemyState.yVel > GROUND_MOVE_SPEED * 1.5
        ? GROUND_MOVE_SPEED * 1.5
        : enemyState.yVel + yGrav;

    const nextY = container.y + enemyState.yVel;
    if (nextY > APP_HEIGHT + GROUND_TILE_HEIGHT) exitedScreen();
    container.y = nextY;
    container.rotation += 0.1;
  };

  const checkDeathFrame = (): void => {
    if (animDie.currentFrame === 4) {
      animDie.stop();
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

  return { container, update, gotKilled, getStatus, getDps, getCoinsDropped };
};
