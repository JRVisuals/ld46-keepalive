import * as PIXI from 'pixi.js';
import gsap, { Power0, Bounce } from 'gsap';
import { ENEMY_ICON_WRAP, ENEMY_ICON_DIM } from '../../constants';

export interface WaveInfo {
  num: number;
  name: string;
  totalEnemies: number;
  enemiesSlain: number;
}

interface State {
  waveInfo: WaveInfo;
}

export interface WavedDisplay {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  updateDisplay: (waveInfo: WaveInfo) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

/**
 * Displays the current wave information: name and enemies alive/dead.
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const waveDisplay = (props: Props): WavedDisplay => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'waveDisplay';

  let state: State = {
    waveInfo: {
      num: -1,
      name: '',
      totalEnemies: 0,
      enemiesSlain: 0,
    },
  };
  const initialState: State = { ...state };

  const waveString = (): string => `${state.waveInfo.name}`;

  // const texture = PIXI.Texture.from('./assets/coin.png');
  // const sprite = new PIXI.Sprite(texture);
  // sprite.anchor.set(0.5);
  // container.addChild(sprite);

  // Text
  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Impact, Charcoal, sans-serif',
    fontSize: 14,
    fontWeight: 'bold',
    fill: ['#fff'],
    fillGradientType: 1,
    fillGradientStops: [0.35],
    dropShadow: false,
    dropShadowColor: '#000000',
    dropShadowBlur: 10,
    dropShadowDistance: 5,
  });

  const waveText = new PIXI.Text(waveString(), textStyle);
  waveText.anchor.set(1);

  container.addChild(waveText);

  // Enemy Alive / Dead Skull Icons
  const enemyAliveTex = PIXI.Texture.from('./assets/enemyskull0.png');
  const enemyDeadTex = PIXI.Texture.from('./assets/enemyskull1.png');
  // Set container for the icons
  const enemyIconsAlive = new PIXI.Container();
  enemyIconsAlive.name = 'enemyIconsAlive';
  enemyIconsAlive.x = -5;
  enemyIconsAlive.y = 7;
  container.addChild(enemyIconsAlive);
  const enemyIconsDead = new PIXI.Container();
  enemyIconsDead.name = 'enemyIconsDead';
  enemyIconsDead.x = -5;
  enemyIconsDead.y = 7;
  container.addChild(enemyIconsDead);

  // Update the display of enemy icons
  const updateEnemyIcons = ({ isNewWave }): void => {
    // Pull latest stats from state
    const { totalEnemies, enemiesSlain } = state.waveInfo;

    // Live Enemy Icons
    if (isNewWave) {
      // Clear out both the dead and live icons on new waves
      enemyIconsAlive.removeChildren(0, enemyIconsAlive.children.length);
      enemyIconsDead.removeChildren(0, enemyIconsDead.children.length);
      // Lay down the empty "alive" icons
      // this only happens when we're on a new wave
      for (let i = 0; i < totalEnemies; i++) {
        const enemyIconSprite = new PIXI.Sprite(enemyAliveTex);
        enemyIconSprite.anchor.set(0.5);
        const thisIcon = enemyIconsAlive.addChild(enemyIconSprite);
        thisIcon.y = i < ENEMY_ICON_WRAP ? 0 : ENEMY_ICON_DIM - 2;
        thisIcon.x =
          i < ENEMY_ICON_WRAP
            ? -ENEMY_ICON_DIM * i
            : -ENEMY_ICON_DIM * (i - ENEMY_ICON_WRAP);
        // Animate these in
        enemyIconSprite.alpha = 0;
        enemyIconSprite.scale.set(0.5);
        // Animate the icon on
        gsap.to(enemyIconSprite, 0.3, {
          alpha: 1,
          ease: Power0.easeOut,
          delay: 0.1 * i,
        });
        gsap.to(enemyIconSprite, 0.45, {
          pixi: { scale: 1 },
          ease: Bounce.easeOut,
          delay: 0.1 * i,
        });
      }
    }

    // Dead Enemy Icons
    for (let i = 0; i < enemiesSlain; i++) {
      const enemyIconSprite = new PIXI.Sprite(enemyDeadTex);
      enemyIconSprite.anchor.set(0.5);
      const thisIcon = enemyIconsDead.addChild(enemyIconSprite);
      thisIcon.y = i < ENEMY_ICON_WRAP ? 0 : ENEMY_ICON_DIM - 2;
      thisIcon.x =
        i < ENEMY_ICON_WRAP
          ? -ENEMY_ICON_DIM * i
          : -ENEMY_ICON_DIM * (i - ENEMY_ICON_WRAP);

      // If this is a new skull (the last one on the list) animate it on
      if (i === enemiesSlain - 1) {
        enemyIconSprite.alpha = 0;
        enemyIconSprite.scale.set(1.5);
        // Animate the icon on
        gsap.to(enemyIconSprite, 0.3, {
          alpha: 1,
          ease: Power0.easeOut,
        });
        gsap.to(enemyIconSprite, 0.45, {
          pixi: { scale: 1 },
          ease: Bounce.easeOut,
        });
      }
    }
  };

  const updateWaveText = ({ isNewWave }): void => {
    waveText.text = waveString();
    if (isNewWave) {
      waveText.alpha = 0;
      gsap.to(waveText, 1, {
        alpha: 1,
        ease: Power0.easeOut,
      });
    }
  };

  const updateDisplay = (waveInfo: WaveInfo): void => {
    const isNewWave = state.waveInfo.num != waveInfo.num;
    state = { ...state, waveInfo: { ...waveInfo } };
    //console.table(state);
    updateWaveText({ isNewWave });
    updateEnemyIcons({ isNewWave });
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    updateWaveText({ isNewWave: true });
    updateEnemyIcons({ isNewWave: true });
  };
  reset();

  const update = (delta): void => {
    // Update called by main
  };

  return { container, reset, update, updateDisplay };
};
