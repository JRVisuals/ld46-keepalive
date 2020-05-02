import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import jrvascii from './util/jrvascii';
import initPIXI, { PixiConfig } from './pixi';
import {
  APP_HEIGHT,
  APP_WIDTH,
  GROUND_TILE_HEIGHT,
  GROUND_TILE_WIDTH,
  HERO_HEIGHT,
} from './constants';
import './index.scss';

import * as COMP from './components';
import * as HERO from './components/hero';
import { Sounds } from './components/audio';

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

type SpriteSheets = {
  main: PIXI.Spritesheet | null;
};
interface BootstrapApp {
  app: PIXI.Application;
}

const onAssetsLoaded = (): void => {
  console.log('onAssetsLoaded');

  // Store preloade spritesheets
  const spriteSheets = {
    main: PIXI.Loader.shared.resources['mainSprites'].spritesheet,
  };
  const sounds: Sounds = {
    MainTheme: PIXI.Loader.shared.resources['MainTheme'],
    Somber: PIXI.Loader.shared.resources['Somber'],
  };

  // Boostrap the app once assets are loaded
  // TODO add proper preloader
  bootstrapApp({ spriteSheets, sounds });
};

const preloader = PIXI.Loader.shared;
preloader
  .add('mainSprites', './assets/ld46sprites.json')
  .add('MainTheme', './assets/KeepYeAlive_MainRiff.mp3')
  .add('Somber', './assets/KeepYeAlive_Somber.mp3');

preloader.load(onAssetsLoaded);
preloader.onProgress.add((e, f) =>
  console.log(`Progress ${Math.floor(e.progress)} (${f.name}.${f.extension})`)
);

/**
 * Kicks off the application proper by instantiating the various components and wiring up their update methods to the update loop of the main application.
 *
 * @param props - Preloaded assets ({@link Spritesheets)}, {@link Sounds}) are passed in via props
 *
 */
const bootstrapApp = (props: {
  spriteSheets: SpriteSheets;
  sounds: Sounds;
}): BootstrapApp => {
  jrvascii();

  // Instantiate PIXI
  PixiPlugin.registerPIXI(PIXI);
  gsap.registerPlugin(PixiPlugin);
  const { pixiApp, mainContainer } = initPIXI(pixiConfig, hostDiv);
  pixiApp.renderer.autoDensity = true;

  const { spriteSheets, sounds } = props;

  // Declare component variables in advance when needed
  let hero: HERO.Hero = null;
  let runtime = null;
  let enemyManager = null;

  // Add music as a component
  const audioLayer = COMP.audio(sounds);
  audioLayer.music.mainTheme();

  // Background
  const bg = COMP.background({});
  mainContainer.addChild(bg.container);

  // Ground
  const ground = COMP.ground({
    pos: {
      x: GROUND_TILE_WIDTH * -1,
      y: APP_HEIGHT - GROUND_TILE_HEIGHT * 0.5,
    },
    groundTiles: spriteSheets.main.animations['ground'],
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
      enemyManager.reset();
      // shop.reset();
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
      y: APP_HEIGHT - GROUND_TILE_HEIGHT - HERO_HEIGHT * 0.5 + 5,
    },
  });
  hero = COMP.hero({
    pos: {
      x: APP_WIDTH * 0.25,
      y: APP_HEIGHT - GROUND_TILE_HEIGHT - HERO_HEIGHT * 0.5 + 5,
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
    anims: { hourglass: spriteSheets.main.animations['hourglass'] },
  });
  mainContainer.addChild(shop.container);

  // Enemy Manager
  enemyManager = COMP.enemyManager({
    pos: {
      x: APP_WIDTH - GROUND_TILE_WIDTH,
      y: APP_HEIGHT - GROUND_TILE_HEIGHT - HERO_HEIGHT * 0.5 + 8,
    },
    anims: {
      enemyCubeGreenWalk: spriteSheets.main.animations['enemy_cubeGreen_walk'],
      enemyCubeGreenDie: spriteSheets.main.animations['enemy_cubeGreen_die'],
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
