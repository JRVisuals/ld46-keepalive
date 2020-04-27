import * as PIXI from 'pixi.js';
import * as PIXISOUND from 'pixi-sound';
import * as SHOP from '../shop/shopItems';
import {
  ENEMY_DPH,
  GROUND_MOVE_SPEED,
  GRAVITY_Y,
  APP_HEIGHT,
  TILE_HEIGHT,
  TILE_WIDTH,
  HERO_FRAMES,
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
  getStatus: () => STATUS;
  buyPotion: (itemData: SHOP.ItemData) => boolean;
}

export enum STATUS {
  SPAWNING,
  DYING,
  RECOVERING,
  ON_SCREEN,
  OFF_SCREEN,
}

interface HeroState {
  hp: number;
  xOrrig: number;
  yOrrig: number;
  yVel: number;
  xVel: number;
  status: STATUS;
  effects: {
    shield: number;
    cooldownSpeed: number;
  };
}

interface Props {
  pos?: { x: number; y: number };
  heroNubmers: HeroNumbers;
  hpDisplay: (hp: number, shield: number) => void;
  coinDisplay: Coin;
  onHeroDied: () => void;
}

export const hero = (props: Props): Hero => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();

  const { heroNubmers, hpDisplay, coinDisplay, onHeroDied } = props;

  let state = {
    hp: 100,
    xOrrig: 0 - TILE_WIDTH,
    yOrrig: pos.y,
    yVel: 0,
    xVel: GROUND_MOVE_SPEED * 0.5,
    status: STATUS.SPAWNING,
    effects: {
      shield: 0,
      cooldownSpeed: 0,
    },
  };

  const initialState = { ...state };

  // Old school spritesheet
  const frames = [];
  for (let i = 1; i <= HERO_FRAMES; i++) {
    frames.push(PIXI.Texture.from(`./assets/hero${i}.png`));
  }
  const anim = new PIXI.AnimatedSprite(frames);
  anim.animationSpeed = 0.12;
  anim.gotoAndPlay(0);
  anim.anchor.set(0.5);
  container.addChild(anim);

  // Sound bits
  const pixiSound = PIXISOUND.default;
  // Load these up on startup...
  pixiSound.add('scream', './assets/wilhelm.mp3');
  pixiSound.add('gotHit', './assets/gotHit1.mp3');
  pixiSound.add('attack', './assets/attack1.mp3');
  pixiSound.add('quaf', './assets/quaf.mp3');
  pixiSound.add('quafquick', './assets/quaf-short.mp3');

  const updateHpDisplay = (): void => {
    console.log(`now hero has ${state.hp}HP and ${state.effects.shield}SHIELD`);
    hpDisplay(state.hp, state.effects.shield);
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    container.x = state.xOrrig;
    container.y = state.yOrrig;
    container.rotation = 0;
    updateHpDisplay();
    anim.gotoAndPlay(0);
  };
  reset();

  // Buff / Debuf for Shield Potion - just adds a number to the state
  // Armor basically acts as overheal and soaks up (physical) damage first
  const buffShield = (amount: number, duration: number): void => {
    state.effects.shield += amount;
    state.effects.shield < 0 ? (state.effects.shield = 0) : null;
    updateHpDisplay();
    // If we have a duration, set the timeout to nullify the effects
    duration &&
      setTimeout(() => {
        buffShield(amount * -1, 0);
      }, duration);
  };

  const doAttack = (): void => {
    pixiSound.play('attack', { loop: false, volume: 1 });
  };
  const getDead = (): void => {
    if (state.status === STATUS.DYING) return;
    anim.gotoAndStop(1);
    state.status = STATUS.DYING;
    state.yVel = -6;
    pixiSound.play('scream', { loop: false, volume: 0.5 });
    onHeroDied();
  };

  const getCurrentFrame = (): number => anim.currentFrame;

  // Returns false if the purchase failed for some reason
  const buyPotion = (itemData: SHOP.ItemData): boolean => {
    if (state.status != STATUS.ON_SCREEN) return false;
    const { goodPurchase } = coinDisplay.subtractCoin(itemData.cost);
    // Make sure we can affor this
    if (!goodPurchase) return false;

    // play uncorking sound
    pixiSound.stop('quaf');
    pixiSound.stop('quafquick');
    Math.random() > 0.75
      ? pixiSound.play('quaf', { loop: false, volume: 1 })
      : pixiSound.play('quafquick', { loop: false, volume: 1 });

    switch (itemData.action) {
      case SHOP.Actions.HEAL:
        // execute healing action
        const POTION_HEAL = itemData.amount;
        const newHp =
          state.hp + POTION_HEAL <= 100 ? state.hp + POTION_HEAL : 100;
        state.hp = newHp;
        heroNubmers.animateNumbers({
          damageDone: POTION_HEAL,
          isHealing: true,
        });
        updateHpDisplay();
        break;
      case SHOP.Actions.SHIELD:
        // execute shield buff
        buffShield(itemData.amount, itemData.duration);
        updateHpDisplay();
        break;
    }

    return true;
  };
  const getStatus = (): STATUS => {
    return state.status;
  };
  const getCoin = (): void => {
    coinDisplay.addCoin();
  };

  const gotHit = (): void => {
    if (state.status !== STATUS.ON_SCREEN) return;

    state.status = STATUS.RECOVERING;
    state.yVel = -2 * Math.random() * 2 - 1;
    state.xVel = -2 * Math.random() * 3 - 2;

    // Buffs
    const damageReduction = 0;
    const damageTaken = ENEMY_DPH - damageReduction;
    const damageDone = damageTaken > 0 ? damageTaken : 0;
    let newHp;
    let newShield;
    if (state.effects.shield > 0) {
      // block sound here
      pixiSound.play('gotHit', { loop: false, volume: 0.2 });
      newShield =
        state.effects.shield - damageDone >= 0
          ? state.effects.shield - damageDone
          : 0;
      state.effects.shield = newShield;
      // animate blocked numbers?
    } else {
      pixiSound.play('gotHit', { loop: false, volume: 0.5 });
      newHp = state.hp - damageDone >= 0 ? state.hp - damageDone : 0;
      state.hp = newHp;
      heroNubmers.animateNumbers({ damageDone, isHealing: false });
    }
    updateHpDisplay();
    if (newHp === 0) getDead();
  };

  const exitedScreen = (): void => {
    state.status = STATUS.OFF_SCREEN;
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
      state.status = STATUS.ON_SCREEN;
    }
    container.x = nextX;
  };
  const spawnToHome = (): void => {
    if (state.status !== STATUS.SPAWNING) return;
    let nextX = container.x + state.xVel;
    if (nextX >= pos.x) {
      nextX = pos.x;
      state.xVel = 0;
      state.status = STATUS.ON_SCREEN;
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
      case STATUS.OFF_SCREEN:
        break;
      case STATUS.ON_SCREEN:
        moveToGround();
      case STATUS.SPAWNING:
        spawnToHome();
        break;
      case STATUS.RECOVERING:
        moveToGround();
        moveToHome();
        break;
      case STATUS.DYING:
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
