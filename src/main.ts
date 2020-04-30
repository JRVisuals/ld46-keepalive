import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import jrvascii from './util/jrvascii';
import initPIXI, { PixiConfig } from './pixi';
import {
  APP_HEIGHT,
  APP_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  HERO_HEIGHT,
} from './constants';
import './index.scss';

import * as COMP from './components';
import * as HERO from './components/hero';

const hostDiv = document.getElementById('canvas');
const hostWidth = APP_WIDTH;
const hostHeight = APP_WIDTH * (APP_HEIGHT / APP_WIDTH);
const pixiConfig: PixiConfig = {
  width: hostWidth,
  height: hostHeight,
  backgroundColor: 0x282c34,
  antialias: false,
  resolution: 3, // window.devicePixelRatio || 1,
};
// No anti-alias
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

interface BootstrapApp {
  app: PIXI.Application;
}

const bootstrapApp = (props: { animations: any }): BootstrapApp => {
  jrvascii();

  // Instantiate PIXI
  PixiPlugin.registerPIXI(PIXI);
  gsap.registerPlugin(PixiPlugin);
  const { pixiApp, mainContainer } = initPIXI(pixiConfig, hostDiv);
  pixiApp.renderer.autoDensity = true;

  const { animations } = props;

  // Declare component variables in advance when needed
  let hero: HERO.Hero = null;
  let runtime = null;

  // Add music as a component
  const audioLayer = COMP.audio();
  audioLayer.music.mainTheme();

  // Background
  const bg = COMP.background({});
  mainContainer.addChild(bg.container);

  // Ground
  const ground = COMP.ground({
    pos: {
      x: TILE_WIDTH * -1,
      y: APP_HEIGHT - TILE_HEIGHT * 0.5,
    },
  });
  mainContainer.addChild(ground.container);

  // Hearts
  const hearts = COMP.hearts({ pos: { x: 32, y: 32 } });
  mainContainer.addChild(hearts.container);

  // Coin
  const coin = COMP.coin({ pos: { x: 30, y: APP_HEIGHT - 30 } });
  mainContainer.addChild(coin.container);

  // Play Again Button
  let btnAgain = null;

  const onPlayAgain = (): void => {
    console.log('play again called');
    if (hero.getStatus() === HERO.STATUS.OFF_SCREEN) {
      hero.reset();
      coin.reset();
      runtime.reset();
      // shop.reset();
      // enemyManager.reset();
      btnAgain.setEnabled(false);
      audioLayer.music.mainTheme();
    }
  };
  btnAgain = COMP.btnAgain({
    onPress: onPlayAgain,
    pos: { x: APP_WIDTH / 2, y: APP_HEIGHT / 2 + 50 },
  });
  btnAgain.setEnabled(false);

  // Events
  const onHeroDied = (): void => {
    console.log('enabling button');
    audioLayer.music.somber();
    btnAgain.setEnabled(true);
  };

  // Hero
  const heroNubmers = COMP.heroNumbers({
    pos: {
      x: APP_WIDTH * 0.25,
      y: APP_HEIGHT - TILE_HEIGHT - HERO_HEIGHT * 0.5 + 5,
    },
  });
  hero = COMP.hero({
    pos: {
      x: APP_WIDTH * 0.25,
      y: APP_HEIGHT - TILE_HEIGHT - HERO_HEIGHT * 0.5 + 5,
    },
    heroNubmers: heroNubmers,
    hpDisplay: hearts.updateDisplay,
    coinDisplay: coin,
    onHeroDied,
  });
  mainContainer.addChild(hero.container);
  mainContainer.addChild(heroNubmers.container);

  // Run Time
  runtime = COMP.runtime({ hero, pos: { x: 55, y: 30 } });
  mainContainer.addChild(runtime.container);

  // Wave Display
  const waveDisplay = COMP.waveDisplay({
    pos: { x: APP_WIDTH - 10, y: APP_HEIGHT - 30 },
  });
  mainContainer.addChild(waveDisplay.container);

  // Shoppe
  const shop = COMP.shop({
    pos: { x: APP_WIDTH - 217, y: 5 },
    hero,
    anims: { hourglass: animations.hourglass },
  });
  mainContainer.addChild(shop.container);

  // Enemy Manager
  const enemyManager = COMP.enemyManager({
    pos: {
      x: APP_WIDTH - TILE_WIDTH,
      y: APP_HEIGHT - TILE_HEIGHT - HERO_HEIGHT * 0.5 + 12,
    },
    updateWaveDisplay: waveDisplay.updateDisplay,
  });
  mainContainer.addChild(enemyManager.container);

  mainContainer.addChild(btnAgain.container);

  // Register component UPDATE routines
  // ------------------------------------
  pixiApp.ticker.add((delta) => {
    // Update All The Things
    ground.update(delta);
    bg.update(delta);
    enemyManager.update(delta);
    enemyManager.checkCollisions(hero);
    hero.update(delta);
    runtime.update(delta);
  });

  return { app: pixiApp };
};

const onAssetsLoaded = (): void => {
  console.log('onAssetsLoaded');

  // Hold all animations in an array
  const animations = {};

  // Create animations from loaded sheets and assets
  const animName = 'hourglass';
  const sheet =
    PIXI.Loader.shared.resources['./assets/ld46sprites.json'].spritesheet;
  animations[animName] = sheet;
  console.log('sheet', sheet, animations);

  // Boostrap the app once assets are loaded
  // TODO add proper preloader
  bootstrapApp({ animations });
};

PIXI.Loader.shared.add('./assets/ld46sprites.json').load(onAssetsLoaded);
