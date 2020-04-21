import * as PIXI from 'pixi.js';
import {
  GROUND_MOVE_SPEED,
  APP_WIDTH,
  TILE_WIDTH,
  HERO_ATTACK_FRAME,
  HERO_COLLISION_BUFFER,
} from '../../constants';
import { enemy, Enemy } from '.';
import { Hero, hero } from '../hero';

interface ManagerReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  checkCollisions: (hero: Hero) => void;
}

interface ManagerProps {
  pos?: { x: number; y: number };
}

export const enemyManager = (props: ManagerProps): ManagerReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const enemies = [];

  const minSpawnGap = 5000;
  let timeSinceLastSpawn = 0;

  const container = new PIXI.Container();

  const destroyEnemy = (enemyContainer: PIXI.Sprite | PIXI.Container): void => {
    container.removeChild(enemyContainer);
    enemies.forEach((enemy, i) => {
      // Remove enemy from array
      if (enemyContainer === enemy.container) enemies.splice(i, 1);
    });
  };

  let lastHeroStatus = '';

  const checkCollisions = (hero: Hero): void => {
    lastHeroStatus = hero.getStatus();
    enemies.forEach((enemy) => {
      if (
        enemy.container.x <= hero.container.x + HERO_COLLISION_BUFFER &&
        enemy.container.x >= hero.container.x - HERO_COLLISION_BUFFER
      ) {
        if (
          hero.getCurrentFrame() == HERO_ATTACK_FRAME &&
          enemy.self.getStatus() != 'DYING'
        ) {
          enemy.self.gotKilled();
          hero.doAttack();
          hero.getCoin();
        } else {
          hero.gotHit();
        }
      }
    });
  };

  const spawnEnemy = (): void => {
    if (lastHeroStatus === 'SPAWNING') return;
    // Enemy
    const newPos = { ...pos, x: APP_WIDTH + TILE_WIDTH };
    const newEnemy = enemy({
      pos: newPos,
      destroyManagerInstance: destroyEnemy,
    });
    enemies.push({ self: newEnemy, container: newEnemy.container });
    container.addChild(newEnemy.container);
  };

  const update = (delta): void => {
    // Update called by main
    if (Math.random() > 0.9 && Date.now() > timeSinceLastSpawn + minSpawnGap) {
      timeSinceLastSpawn = Date.now();
      spawnEnemy();
    }

    enemies.forEach((enemy) => {
      enemy.self.update();
    });
  };

  return { container, update, checkCollisions };
};
