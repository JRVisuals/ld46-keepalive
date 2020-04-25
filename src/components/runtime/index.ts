import * as PIXI from 'pixi.js';
import * as HERO from '../hero';

export interface RunTime {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
  hero: HERO.Hero;
}

export const runtime = (props: Props): RunTime => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const { hero } = props;

  let state = {
    currentTime: 0,
  };

  const initialState = { ...state };

  const timeString = (): string => {
    return `${state.currentTime.toFixed(2)}`;
  };

  // Text
  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Impact, Charcoal, sans-serif',
    fontSize: 28,
    fontWeight: 'bold',
    fill: ['#ccc'],
    fillGradientType: 1,
    fillGradientStops: [0.35],
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 10,
    dropShadowDistance: 5,
  });

  const timeText = new PIXI.Text(timeString(), textStyle);
  timeText.anchor.set(0, 0.5);
  // timeText.x = 40;
  // timeText.y = 2;

  container.addChild(timeText);

  const updateTimeText = (): void => {
    timeText.text = timeString();
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    updateTimeText();
  };
  reset();

  let lastUpdateTime = Date.now();

  const update = (delta): void => {
    // Update called by main
    if (
      hero.getStatus() === HERO.STATUS.OFF_SCREEN ||
      hero.getStatus() === HERO.STATUS.SPAWNING
    )
      return;
    if (Date.now() > lastUpdateTime + 10) {
      state.currentTime += 0.01;
      updateTimeText();
      lastUpdateTime = Date.now();
    }
  };

  return { container, reset, update };
};
