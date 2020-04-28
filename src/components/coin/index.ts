import * as PIXI from 'pixi.js';

export interface Coin {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
  addCoin: (num?: number) => number;
  subtractCoin: (num?: number) => { newTotal: number; goodPurchase: boolean };
}

interface Props {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
}

export const coin = (props: Props): Coin => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'coin';

  let state = {
    total: 0,
  };

  const initialState = { ...state };

  const coinString = (): string => `= ${state.total}`;

  const texture = PIXI.Texture.from('./assets/coin.png');
  const sprite = new PIXI.Sprite(texture);
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

  const addCoin = (num = 1): number => {
    const newTotal = state.total + num;
    state = { ...state, total: newTotal };
    updateCoinText();
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
