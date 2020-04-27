import * as PIXI from 'pixi.js';
import {
  GROUND_MOVE_SPEED,
  APP_WIDTH,
  TILE_WIDTH,
  HERO_ATTACK_FRAME,
  HERO_COLLISION_BUFFER,
  ENEMY_RESPAWN_COOLDOWN,
} from '../../constants';
import { enemy, Enemy } from '.';
import * as HERO from '../hero';

interface ManagerReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  checkCollisions: (hero: HERO.Hero) => void;
}

interface ManagerProps {
  pos?: { x: number; y: number };
}

export const enemyManager = (props: ManagerProps): ManagerReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const enemies = [];

  let timeSinceLastSpawn = 0;

  const container = new PIXI.Container();

  const destroyEnemy = (enemyContainer: PIXI.Sprite | PIXI.Container): void => {
    container.removeChild(enemyContainer);
    enemies.forEach((enemy, i) => {
      // Remove enemy from array
      if (enemyContainer === enemy.container) enemies.splice(i, 1);
    });
  };

  let lastHeroStatus: HERO.STATUS = null;

  const checkCollisions = (hero: HERO.Hero): void => {
    lastHeroStatus = hero.getStatus();
    enemies.forEach((enemy) => {
      if (
        // In collision range, and enemy is not mid-death
        enemy.container.x <= hero.container.x + HERO_COLLISION_BUFFER &&
        enemy.container.x >= hero.container.x - HERO_COLLISION_BUFFER &&
        enemy.self.getStatus() != 'DYING'
      ) {
        if (
          // Hero is attacking and enemy is not dying
          hero.getCurrentFrame() == HERO_ATTACK_FRAME
        ) {
          // Hero Attacks!
          enemy.self.gotKilled();
          hero.doAttack();
          hero.getCoin();
        } else {
          // Hero is hit
          hero.gotHit();
        }
      }
    });
  };

  const spawnEnemy = (): void => {
    if (lastHeroStatus === HERO.STATUS.SPAWNING) return;
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
    if (
      Math.random() > 0.9 &&
      Date.now() > timeSinceLastSpawn + ENEMY_RESPAWN_COOLDOWN
    ) {
      timeSinceLastSpawn = Date.now();
      spawnEnemy();
    }

    enemies.forEach((enemy) => {
      enemy.self.update();
    });
  };

  return { container, update, checkCollisions };
};
