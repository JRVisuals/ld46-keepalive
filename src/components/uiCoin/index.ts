import * as PIXI from 'pixi.js';
import { HERO_START_GOLD } from '../../constants';
import gsap, { Bounce } from 'gsap';

export interface UiCoin {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  addCoin: (num?: number) => number;
  subtractCoin: (num?: number) => { newTotal: number; goodPurchase: boolean };
}

interface Props {
  pos?: { x: number; y: number };
  coinTexture: PIXI.Texture;
}

/**
 * Display UI for Hero gold (coins) earned.
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const uiCoin = (props: Props): UiCoin => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'coin';

  const { coinTexture } = props;

  let state = {
    total: HERO_START_GOLD,
  };

  const initialState = { ...state };

  const coinString = (): string => `= ${state.total}`;

  const sprite = new PIXI.Sprite(coinTexture);
  sprite.anchor.set(0.5);
  container.addChild(sprite);

  // Text
  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Impact, Charcoal, sans-serif',
    fontSize: 18,
    fontWeight: 'bold',
    fill: ['#fff'],
    fillGradientType: 1,
    fillGradientStops: [0.35],
    dropShadow: false,
    dropShadowColor: '#000000',
    dropShadowBlur: 10,
    dropShadowDistance: 5,
  });

  const coinText = new PIXI.Text(coinString(), textStyle);
  coinText.anchor.set(0, 0.5);
  coinText.x = 20;
  coinText.y = -1;

  container.addChild(coinText);

  const updateCoinText = (): void => {
    coinText.text = coinString();
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    updateCoinText();
  };
  reset();

  const animateCoin = (): void => {
    sprite.scale.set(0.75);
    gsap.to(sprite, 0.45, {
      pixi: { scale: 1 },
      ease: Bounce.easeOut,
    });
  };

  const addCoin = (num = 1): number => {
    const newTotal = state.total + num;
    state = { ...state, total: newTotal };
    updateCoinText();
    animateCoin();
    return newTotal;
  };

  const subtractCoin = (
    num = -1
  ): { newTotal: number; goodPurchase: boolean } => {
    const coinsToSubtract = num > 0 ? num * -1 : num;

    const newTotal = state.total + coinsToSubtract;
    const goodPurchase = newTotal >= 0 ? true : false;
    if (goodPurchase) state = { ...state, total: newTotal };
    updateCoinText();
    return { newTotal, goodPurchase };
  };

  const update = (delta): void => {
    // Update called by main
  };

  return { container, reset, update, addCoin, subtractCoin };
};
