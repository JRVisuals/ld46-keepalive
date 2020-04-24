import * as PIXI from 'pixi.js';
import { PixiPlugin } from 'gsap/PixiPlugin';
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

import * as comp from './components';
import { Hero } from './components/hero';

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

(function app(): void {
  jrvascii();
  // PixiPlugin.registerPIXI(PIXI);

  const { app, mainContainer } = initPIXI(pixiConfig, hostDiv);
  app.renderer.autoDensity = true;

  let hero: Hero = null;

  // Background
  const bg = comp.background({});
  mainContainer.addChild(bg.container);

  // Ground
  const ground = comp.ground({
    pos: {
      x: TILE_WIDTH * -1,
      y: APP_HEIGHT - TILE_HEIGHT * 0.5,
    },
  });
  mainContainer.addChild(ground.container);

  // Hearts
  const hearts = comp.hearts({ pos: { x: 30, y: 30 } });
  mainContainer.addChild(hearts.container);

  // Coin
  const coin = comp.coin({ pos: { x: 30, y: APP_HEIGHT - 30 } });
  mainContainer.addChild(coin.container);

  // Play Again Button
  let btnAgain = null;
  const onPlayAgain = (): void => {
    if (hero.getStatus() === 'OFF_SCREEN') {
      hero.reset();
      coin.reset();
      runtime.reset();
      // shop.reset();
      // enemyManager.reset();
      btnAgain.setEnabled(false);
    }
  };
  btnAgain = comp.btnAgain({
    onPress: onPlayAgain,
    pos: { x: APP_WIDTH / 2, y: APP_HEIGHT / 2 + 50 },
  });
  btnAgain.setEnabled(false);

  // Events
  const onHeroDied = (): void => {
    btnAgain.setEnabled(true);
  };

  // Hero
  const heroNubmers = comp.heroNumbers({
    pos: {
      x: APP_WIDTH * 0.25,
      y: APP_HEIGHT - TILE_HEIGHT - HERO_HEIGHT * 0.5 + 8,
    },
  });
  hero = comp.hero({
    pos: {
      x: APP_WIDTH * 0.25,
      y: APP_HEIGHT - TILE_HEIGHT - HERO_HEIGHT * 0.5 + 8,
    },
    heroNubmers: heroNubmers,
    hpDisplay: hearts.updateDisplay,
    coinDisplay: coin,
    onHeroDied,
  });
  mainContainer.addChild(hero.container);
  mainContainer.addChild(heroNubmers.container);

  // Run Time
  const runtime = comp.runtime({ hero, pos: { x: 55, y: 30 } });
  mainContainer.addChild(runtime.container);

  // Shoppe
  const shop = comp.shop({ pos: { x: APP_WIDTH - 217, y: 5 }, hero });
  mainContainer.addChild(shop.container);

  // Enemy Manager
  const enemyManager = comp.enemyManager({
    pos: {
      x: APP_WIDTH - TILE_WIDTH,
      y: APP_HEIGHT - TILE_HEIGHT - HERO_HEIGHT * 0.5 + 12,
    },
  });
  mainContainer.addChild(enemyManager.container);

  mainContainer.addChild(btnAgain.container);

  // Add music as a component
  const audioLayer = comp.audio();
  audioLayer.init();

  // Register component UPDATE routines
  // ------------------------------------
  app.ticker.add((delta) => {
    // Update it
    ground.update(delta);
    bg.update(delta);
    enemyManager.update(delta);
    enemyManager.checkCollisions(hero);
    hero.update(delta);
    runtime.update(delta);
  });
})();
