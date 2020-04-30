import * as PIXI from 'pixi.js';

export interface WaveInfo {
  num: number;
  name: string;
  totalEnemies: number;
  enemisSlain: number;
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

export const waveDisplay = (props: Props): WavedDisplay => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'waveDisplay';

  let state: State = {
    waveInfo: {
      num: 0,
      name: '',
      totalEnemies: 0,
      enemisSlain: 0,
    },
  };
  const initialState: State = { ...state };

  const waveString = (): string => `Current Wave: ${state.waveInfo.name}`;

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

  const updateWaveText = (): void => {
    waveText.text = waveString();
  };

  const updateDisplay = (waveInfo: WaveInfo): void => {
    state = { ...state, waveInfo: { ...waveInfo } };
    console.table(state);
    updateWaveText();
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    updateWaveText();
  };
  reset();

  const update = (delta): void => {
    // Update called by main
  };

  return { container, reset, update, updateDisplay };
};
