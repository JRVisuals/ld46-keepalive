import * as PIXI from 'pixi.js';
import {
  APP_WIDTH,
  TILE_WIDTH,
  HERO_ATTACK_FRAME,
  HERO_COLLISION_BUFFER,
} from '../../constants';
import { enemy } from '.';
import * as HERO from '../hero';

import { waves, Wave } from './waves';
import { WaveInfo } from '../waveDisplay/';

interface ManagerReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  checkCollisions: (hero: HERO.Hero) => void;
}

interface ManagerProps {
  pos?: { x: number; y: number };
  updateWaveDisplay: (waveInfo: WaveInfo) => void;
}

interface State {
  currentWaveNum: number;
  currentWaveData: Wave;
  currentWaveEnemiesSlain: number;
}
export const enemyManager = (props: ManagerProps): ManagerReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const { updateWaveDisplay } = props;

  const initialState: State = {
    currentWaveNum: 0,
    currentWaveData: null,
    currentWaveEnemiesSlain: 0,
  };

  let state: State = { ...initialState };

  const enemiesOnScreen = [];

  let timeSinceLastSpawn = 0;

  const container = new PIXI.Container();
  container.name = 'enemyManager';

  // Waves -------------------------------
  const startWave = (): void => {
    const waveData = waves[state.currentWaveNum];
    state = { ...state, currentWaveData: waveData, currentWaveEnemiesSlain: 0 };
    console.log(`Starting Wave: ${state.currentWaveData.name}`);
    updateWaveDisplay({
      num: state.currentWaveNum,
      name: state.currentWaveData.name,
      totalEnemies: state.currentWaveData.totalEnemies,
      enemisSlain: state.currentWaveEnemiesSlain,
    });
  };

  const nextWave = (): void => {
    // if we run out of waves let's stay on the final wave for now
    const nextWaveNum =
      state.currentWaveNum + 1 > waves.length - 1
        ? state.currentWaveNum
        : state.currentWaveNum + 1;
    state.currentWaveNum = nextWaveNum;
    startWave();
  };

  const checkWaveStatus = (): void => {
    const waveComplete =
      state.currentWaveEnemiesSlain >= state.currentWaveData.totalEnemies;
    waveComplete ? nextWave() : null;
  };

  const destroyEnemy = (enemyContainer: PIXI.Sprite | PIXI.Container): void => {
    container.removeChild(enemyContainer);
    enemiesOnScreen.forEach((enemy, i) => {
      // Remove enemy from array
      if (enemyContainer === enemy.container) enemiesOnScreen.splice(i, 1);
    });
  };

  let lastHeroStatus: HERO.STATUS = null;

  // Hero Attacks!
  const heroAttacks = ({ enemy, hero }): void => {
    enemy.self.gotKilled();
    hero.doAttack();
    hero.getCoin();

    // Track enemies slain
    state.currentWaveEnemiesSlain++;
    checkWaveStatus();
  };

  const checkCollisions = (hero: HERO.Hero): void => {
    lastHeroStatus = hero.getStatus();
    enemiesOnScreen.forEach((enemy) => {
      if (
        // In collision range, and enemy is not mid-death
        enemy.container.x <= hero.container.x + HERO_COLLISION_BUFFER &&
        enemy.container.x >= hero.container.x - HERO_COLLISION_BUFFER &&
        enemy.self.getStatus() != 'DYING' &&
        enemy.self.getStatus() != 'DEAD'
      ) {
        if (
          // Hero is attacking and enemy is not dying
          hero.getCurrentFrame() == HERO_ATTACK_FRAME
        ) {
          // Hero Attacks!
          heroAttacks({ enemy, hero });
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
    enemiesOnScreen.push({ self: newEnemy, container: newEnemy.container });
    container.addChild(newEnemy.container);
  };

  // Start the first wave immediately
  startWave();

  const update = (delta): void => {
    // Update called by main
    if (
      Math.random() > 0.9 &&
      Date.now() > timeSinceLastSpawn + state.currentWaveData.respawnCooldown
    ) {
      timeSinceLastSpawn = Date.now();
      spawnEnemy();
    }

    enemiesOnScreen.forEach((enemy) => {
      enemy.self.update();
    });
  };

  return { container, update, checkCollisions };
};
