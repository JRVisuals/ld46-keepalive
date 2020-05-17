import * as PIXI from 'pixi.js';
import {
  APP_WIDTH,
  GROUND_TILE_WIDTH,
  HERO_ATTACK_FRAME,
  HERO_COLLISION_BUFFER,
} from '../../constants';
import { enemy, Enemy } from '.';
import { AudioLayer } from '../audio/';
import * as HERO from '../hero';

import { waves, Wave, WaveEnemy } from './waves';
import { WaveInfo } from '../waveDisplay/';
import { DropCoin } from '../dropCoin/';

interface ManagerReturnType {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  checkCollisions: (hero: HERO.Hero) => void;
}

interface ManagerProps {
  pos?: { x: number; y: number };
  anims: { [key: string]: Array<PIXI.Texture> };
  updateWaveDisplay: (waveInfo: WaveInfo) => void;
  audioLayer: AudioLayer;
  dropCoin: DropCoin;
}

interface State {
  currentWaveNum: number;
  currentWaveData: Wave;
  currentWaveEnemiesSlain: number;
}

/**
 * Manages various aspects of on-screen enemies and waves of enemies including collision detection between enemies and The Hero.
 *
 * @param props - Standard component properties. **Plus** A callback to update {@link waveDisplay}
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const enemyManager = (props: ManagerProps): ManagerReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const { anims, updateWaveDisplay, audioLayer, dropCoin } = props;

  const initialState: State = {
    currentWaveNum: 0,
    currentWaveData: null,
    currentWaveEnemiesSlain: 0,
  };

  let state: State = { ...initialState };

  const enemiesOnScreen: Array<Enemy> = [];

  let timeSinceLastSpawn = 0;

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    //enemiesOnScreen = [];
    timeSinceLastSpawn = 0;
    const waveData = waves[state.currentWaveNum];
    state = { ...state, currentWaveData: waveData, currentWaveEnemiesSlain: 0 };
    updateWaveDisplay({
      num: state.currentWaveNum,
      name: state.currentWaveData?.name ?? 'The Void',
      totalEnemies: state.currentWaveData?.totalEnemies ?? 0,
      enemiesSlain: state.currentWaveEnemiesSlain,
    });
  };
  reset();

  const container = new PIXI.Container();
  container.name = 'enemyManager';

  // Waves -------------------------------
  const startWave = (): void => {
    const waveNum = state.currentWaveNum;
    const waveData = waves[waveNum];
    state = { ...state, currentWaveData: waveData, currentWaveEnemiesSlain: 0 };
    console.log(`Starting Wave: ${state.currentWaveData.name}`);
    waveNum != 0 && audioLayer.music.fanfare();
    updateWaveDisplay({
      num: waveNum,
      name: state.currentWaveData.name,
      totalEnemies: state.currentWaveData.totalEnemies,
      enemiesSlain: state.currentWaveEnemiesSlain,
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

  type HeroAttacks = (props: { enemy: Enemy; hero: HERO.Hero }) => void;

  const heroAttacks: HeroAttacks = (props): void => {
    const { enemy, hero } = props;
    enemy.gotKilled();
    hero.doAttack();

    // Drop as many coins as needed...
    for (let i = 0; i < enemy.getCoinsDropped(); i++) {
      setTimeout(() => {
        dropCoin.spawnDrop({ targetSprite: enemy.container });
      }, 150 + i * 50);
    }

    // Track enemies slain
    state.currentWaveEnemiesSlain++;
    updateWaveDisplay({
      num: state.currentWaveNum,
      name: state.currentWaveData.name,
      totalEnemies: state.currentWaveData.totalEnemies,
      enemiesSlain: state.currentWaveEnemiesSlain,
    });
    checkWaveStatus();
  };

  const checkCollisions = (hero: HERO.Hero): void => {
    lastHeroStatus = hero.getStatus();
    enemiesOnScreen.forEach((enemy) => {
      if (
        // In collision range, and enemy is not mid-death
        enemy.container.x <= hero.container.x + HERO_COLLISION_BUFFER &&
        enemy.container.x >= hero.container.x - HERO_COLLISION_BUFFER &&
        enemy.getStatus() != 'DYING' &&
        enemy.getStatus() != 'DEAD'
      ) {
        if (
          // Hero is attacking and enemy is not dying
          hero.getCurrentFrame() == HERO_ATTACK_FRAME
        ) {
          // Hero Attacks!
          heroAttacks({ enemy, hero });
        } else {
          // Hero is hit
          hero.gotHit(enemy.getDps());
        }
      }
    });
  };

  /**
   * Pick random enemy using weighted values (0-1)
   * @returns random wave enemy (weighted) or `false` if not found
   * */
  const getWeightedEnemy = (): WaveEnemy | false => {
    const enemies = state.currentWaveData.enemies;
    let cumulativeWeight = 1;
    const random = Math.random() * 1;
    for (let i = 0; i < enemies.length; i++) {
      const item = enemies[i];
      cumulativeWeight -= item?.weight ?? 0;
      if (random >= cumulativeWeight) {
        return item;
      }
    }
    return false;
  };

  /**
   * Pick random enemy ignoring weights completely
   * @returns random wave enemy
   * */
  const getRandomEnemy = (): WaveEnemy => {
    const random = Math.round(
      Math.random() * (state.currentWaveData.enemies.length - 1)
    );
    const waveEnemy = state.currentWaveData.enemies[random];
    return waveEnemy;
  };

  /**
   * Get random enemy from wave data
   * @returns weighted random enemy if available, completely random enemy if not
   * */
  const getRandomWaveEnemy = (): WaveEnemy => {
    const weighted = getWeightedEnemy();
    const waveEnemy = weighted ? weighted : getRandomEnemy();
    return waveEnemy;
  };

  const spawnEnemy = (): void => {
    if (lastHeroStatus === HERO.STATUS.SPAWNING) return;

    // Pick a random enemy from the current wave. Use weighting if available or strict randomness if not.
    const enemyData = getRandomWaveEnemy();

    const newPos = { ...pos, x: APP_WIDTH + GROUND_TILE_WIDTH };
    const newEnemy = enemy({
      pos: newPos,
      anims,
      data: enemyData,
      destroyManagerInstance: destroyEnemy,
    });
    enemiesOnScreen.push(newEnemy);
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
      enemy.update(delta);
    });
  };

  return { container, reset, update, checkCollisions };
};
