import * as PIXI from 'pixi.js';
import * as PIXISOUND from 'pixi-sound';
import * as SHOP from '../shop/shopItems';
import {
  GROUND_MOVE_SPEED,
  GRAVITY_Y,
  APP_HEIGHT,
  GROUND_TILE_HEIGHT,
  GROUND_TILE_WIDTH,
  HERO_FRAMES,
  SFX_VOL_MULT,
  HERO_START_HP,
} from '../../constants';
import { UiCoin } from '../uiCoin';
import { HeroNumbers } from '../heroNumbers';

export interface Hero {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  getCurrentFrame: () => number;
  gotHit: (enemyDps: number) => void;
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

interface HeroProps {
  pos?: { x: number; y: number };
  heroNubmers: HeroNumbers;
  coinDisplay: UiCoin;
  anims: { [key: string]: Array<PIXI.Texture> };
  hpDisplay: (props) => void;
  onHeroDied: () => void;
}

/**
 * **Our Hero.** Handles all of the hero display and logic other than external items like {@link heroNumbers}, {@link hpDisplay}, {@link coinDisplay}, etc.
 *
 * @param props - Standard component properties. **Plus** References and callbacks to external modules.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const hero = (props: HeroProps): Hero => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();

  container.name = 'hero';

  const { anims, heroNubmers, hpDisplay, coinDisplay, onHeroDied } = props;

  let state = {
    hp: HERO_START_HP,
    xOrrig: 0 - GROUND_TILE_WIDTH,
    yOrrig: pos.y,
    yVel: 0,
    xVel: GROUND_MOVE_SPEED * 0.5,
    status: STATUS.SPAWNING,
    effects: {
      shield: 0,
      shieldExpire: 0,
      cooldownSpeed: 0,
    },
  };

  const initialState = { ...state };

  // Spritesheet ( The Hero )
  const anim = new PIXI.AnimatedSprite(anims['heroRun']);
  anim.animationSpeed = 0.12;
  anim.gotoAndPlay(0);
  anim.anchor.set(0.5);
  container.addChild(anim);

  /**
   * Factory for creating animated sprites specifically to be used in Hero
   * potion quaffing animation. Sets up default values which may be overriden
   * after the fact.
   *
   * @param props - an object defining `textureKey` to be used in creating this animation sprite
   *
   * @returns PIXI.AnimatedSprite which can then be added to the container or modified
   */
  const createEffectAnimation = (props: {
    textureKey: string;
  }): PIXI.AnimatedSprite => {
    const { textureKey } = props;
    const animSprite = new PIXI.AnimatedSprite(anims[textureKey]);
    animSprite.animationSpeed = 0.25;
    animSprite.anchor.set(0.5);
    animSprite.x = -5;
    animSprite.y = -12;
    animSprite.alpha = 0;
    animSprite.loop = false;
    animSprite.onComplete = (): void => {
      animSprite.alpha = 0;
      animSprite.gotoAndStop(0);
    };
    return animSprite;
  };
  // Swirl effect for potion quaf
  const effectSwirl = container.addChild(
    createEffectAnimation({ textureKey: 'effectSwirl' })
  );
  // Blurred Swirl effect for potion quaf
  const effectSwirlBlur = container.addChild(
    createEffectAnimation({ textureKey: 'effectSwirlBlur' })
  );
  effectSwirlBlur.blendMode = PIXI.BLEND_MODES.SCREEN;
  // Pixi dust effect for potion quaf
  const effectPixidust = container.addChild(
    createEffectAnimation({ textureKey: 'effectPixidust' })
  );
  effectPixidust.animationSpeed = 0.15;
  effectPixidust.y = -20;
  effectPixidust.blendMode = PIXI.BLEND_MODES.ADD;

  // Sound bits
  const pixiSound = PIXISOUND.default;
  // Load these up on startup...
  pixiSound.add('scream', './assets/wilhelm.mp3');
  pixiSound.add('gotHit', './assets/gotHit1.mp3');
  pixiSound.add('attack', './assets/attack1.mp3');
  pixiSound.add('block', './assets/block1.mp3');
  pixiSound.add('quaf', './assets/quaf.mp3');
  pixiSound.add('quafquick', './assets/quaf-short.mp3');

  const updateHpDisplay = (): void => {
    console.log(`now hero has ${state.hp}HP and ${state.effects.shield}SHIELD`);
    hpDisplay({ health: state.hp, shield: state.effects.shield });
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
    if (duration > 0) state.effects.shieldExpire = Date.now() + duration;
  };

  const doAttack = (): void => {
    pixiSound.play('attack', { loop: false, volume: 1 * SFX_VOL_MULT });
  };
  const getDead = (): void => {
    if (state.status === STATUS.DYING) return;
    anim.gotoAndStop(1);
    state.status = STATUS.DYING;
    state.yVel = -6;
    pixiSound.play('scream', { loop: false, volume: 0.4 * SFX_VOL_MULT });
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
      ? pixiSound.play('quaf', { loop: false, volume: 1 * SFX_VOL_MULT })
      : pixiSound.play('quafquick', { loop: false, volume: 1 * SFX_VOL_MULT });

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
        // update the heart's fill
        updateHpDisplay();
        // play potion effect animation
        effectSwirl.alpha = 0.8;
        effectSwirl.tint = 0xc00f0f;
        effectSwirl.play();
        effectSwirlBlur.alpha = 1;
        effectSwirlBlur.tint = 0xcc0000;
        effectSwirlBlur.play();
        effectPixidust.alpha = 1;
        effectPixidust.tint = 0xc00f0f;
        effectPixidust.play();
        break;
      case SHOP.Actions.SHIELD:
        // execute shield buff
        buffShield(itemData.amount, itemData.duration);
        // update the heart's fill
        updateHpDisplay();
        // play potion effect animation
        effectSwirl.alpha = 1;
        effectSwirl.tint = 0x89b3ff;
        effectSwirl.play();
        effectSwirlBlur.alpha = 1;
        effectSwirlBlur.tint = 0x89b3ff;
        effectSwirlBlur.play();
        effectPixidust.alpha = 1;
        effectPixidust.tint = 0x89b3ff;
        effectPixidust.play();
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

  const gotHit = (enemyDps): void => {
    if (state.status !== STATUS.ON_SCREEN) return;

    state.status = STATUS.RECOVERING;
    state.yVel = -2 * Math.random() * 2 - 1;
    state.xVel = -2 * Math.random() * 3 - 2;

    // Buffs
    const damageReduction = 0;
    const damageTaken = enemyDps - damageReduction;
    const damageDone = damageTaken > 0 ? damageTaken : 0;
    let newHp;
    let newShield;
    if (state.effects.shield > 0) {
      pixiSound.play('block', { loop: false, volume: 0.45 * SFX_VOL_MULT });
      newShield =
        state.effects.shield - damageDone >= 0
          ? state.effects.shield - damageDone
          : 0;
      state.effects.shield = newShield;
      heroNubmers.animateNumbers({ damageDone: 0, isHealing: false });
      updateHpDisplay();
    } else {
      pixiSound.play('gotHit', { loop: false, volume: 0.65 * SFX_VOL_MULT });
      newHp = state.hp - damageDone >= 0 ? state.hp - damageDone : 0;
      state.hp = newHp;
      heroNubmers.animateNumbers({ damageDone, isHealing: false });
      updateHpDisplay();
    }

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
    if (nextY > APP_HEIGHT + GROUND_TILE_HEIGHT) exitedScreen();
    container.y = nextY;
    container.rotation -= 0.1;
  };

  // Check Buffs
  const checkBuffs = (): void => {
    // Shield Ran Out
    if (state.effects.shield && state.effects.shieldExpire <= Date.now()) {
      state.effects.shield = 0;
      updateHpDisplay();
    }
    // Shield is almost out
    const shieldTimeRemaining = state.effects.shieldExpire - Date.now();
    if (state.effects.shield && shieldTimeRemaining <= 3000) {
      hpDisplay({ shieldTimeRemaining });
    }
  };

  const update = (delta): void => {
    // Update called by main

    // Updates Based on State
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

    checkBuffs();
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
