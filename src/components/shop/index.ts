import * as PIXI from 'pixi.js';
import { Hero } from '../hero';

export interface Shop {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
  hero: Hero;
}

export const shop = (props: Props): Shop => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const { hero } = props;

  let shopState = {
    items: [
      {
        type: 'potion',
        action: 'heal',
        amount: 10,
        cost: 1,
        cooldown: 5000,
      },
    ],
  };

  const texture = PIXI.Texture.from('./assets/shopPanel.png');
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0);
  container.addChild(sprite);

  // Text
  const style = {
    fontFamily: 'Impact, Charcoal, sans-serif',
    fontSize: 10,
    fill: ['#999'],
    fontWeight: 'regular',
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 5,
    dropShadowDistance: 0,
  };
  const textStyleSmall = new PIXI.TextStyle(style);
  const shopTextSmall = new PIXI.Text(
    'Click item to purchase.',
    textStyleSmall
  );
  shopTextSmall.anchor.set(0);
  shopTextSmall.x = 105;
  shopTextSmall.y = 18;
  container.addChild(shopTextSmall);

  const buyPotion = (): void => {
    hero.buyPotion();
  };

  const buyShieldPotion = (): void => {
    // hero.buyPotion();
  };

  const buyBigHealthPotion = (): void => {
    // hero.buyPotion();
  };

  const potionY = 59;
  const potionTexture = PIXI.Texture.from('./assets/healthPotion.png');
  const potionSprite = new PIXI.Sprite(potionTexture);
  potionSprite.anchor.set(0.5);
  potionSprite.x = 42;
  potionSprite.y = potionY;
  container.addChild(potionSprite);
  potionSprite.interactive = true;
  potionSprite.buttonMode = true;
  potionSprite.on('mousedown', buyPotion).on('touchstart', buyPotion);

  const shieldPotionTexture = PIXI.Texture.from('./assets/shieldPotion.png');
  const shieldPotionSprite = new PIXI.Sprite(shieldPotionTexture);
  shieldPotionSprite.anchor.set(0.5);
  shieldPotionSprite.x = 88;
  shieldPotionSprite.y = potionY;
  container.addChild(shieldPotionSprite);
  shieldPotionSprite.interactive = true;
  shieldPotionSprite.buttonMode = true;
  shieldPotionSprite
    .on('mousedown', buyShieldPotion)
    .on('touchstart', buyShieldPotion);

  const bigHealthPotionTexture = PIXI.Texture.from(
    './assets/healthPotion2.png'
  );
  const bigHealthPotionSprite = new PIXI.Sprite(bigHealthPotionTexture);
  bigHealthPotionSprite.anchor.set(0.5);
  bigHealthPotionSprite.x = 134;
  bigHealthPotionSprite.y = potionY;
  container.addChild(bigHealthPotionSprite);
  bigHealthPotionSprite.interactive = true;
  bigHealthPotionSprite.buttonMode = true;
  bigHealthPotionSprite
    .on('mousedown', buyBigHealthPotion)
    .on('touchstart', buyBigHealthPotion);

  const createShopCoins = (): void => {
    const coinData = [
      { cost: 1, posX: 42 },
      { cost: 2, posX: 88 },
      { cost: 3, posX: 134 },
    ];
    coinData.forEach((coins) => {
      const coinsContainer = new PIXI.Container();
      coinsContainer.x = coins.posX;
      coinsContainer.y = potionY + 33;
      container.addChild(coinsContainer);
      for (let i = 0; i < coins.cost; i++) {
        const shopCoinTex = PIXI.Texture.from('./assets/shopCoin.png');
        const shopCoinSprite = new PIXI.Sprite(shopCoinTex);
        shopCoinSprite.anchor.set(0.5);
        shopCoinSprite.x = 10 * i - (coins.cost - 1) * 5;
        coinsContainer.addChild(shopCoinSprite);
      }
    });
  };

  createShopCoins();

  const update = (delta): void => {
    // Update called by main
  };

  return { container, update };
};
