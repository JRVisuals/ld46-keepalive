import * as PIXI from 'pixi.js';
import {
  GROUND_MOVE_SPEED,
  APP_WIDTH,
  APP_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
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

  const texture = PIXI.Texture.from('../../assets/ld46/enemy.png');
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0.5);
  container.addChild(sprite);

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
      enemyState.status === 'DYING'
        ? GROUND_MOVE_SPEED
        : GROUND_MOVE_SPEED * 1.5;
    const nextX = container.x - movementSpeed;
    if (nextX < -TILE_WIDTH) exitedScreen();
    container.x = nextX;
  };

  const gotKilled = (): void => {
    if (enemyState.status === 'DYING') return;
    container.x += 10;
    enemyState.status = 'DYING';
    enemyState.yVel = -5;
  };

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

  const update = (delta): void => {
    // Update called by main
    switch (enemyState.status) {
      case 'OFF_SCREEN':
        return;
        break;
      case 'ON_SCREEN':
        moveTowardHero();
        break;
      case 'DYING':
        moveToDeath();
        moveTowardHero();
        break;
    }
  };

  return { container, update, gotKilled, getStatus };
};
