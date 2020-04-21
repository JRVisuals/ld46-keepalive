import * as PIXI from 'pixi.js';
import { hero, Hero } from '../hero';
import { coin } from '../coin';

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
    healthPotions: 10,
  };

  const texture = PIXI.Texture.from('./assets/shopPanel.png');
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0);
  container.addChild(sprite);

  // Text
  const style = {
    fontFamily: 'Impact, Charcoal, sans-serif',
    fontSize: 12,
    fontWeight: 'bold',
    fill: ['#ccc'],
    fillGradientType: 1,
    fillGradientStops: [0.35],
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 10,
    dropShadowDistance: 0,
  };
  const textStyle = new PIXI.TextStyle(style);
  const textStyleSmall = new PIXI.TextStyle({
    ...style,
    fill: ['#999'],
    fontSize: 12,
    fontWeight: 'regular',
  });

  const shopText = new PIXI.Text('KEEP YE ALIVE', textStyle);
  shopText.anchor.set(0.5);
  shopText.x = 112;
  shopText.y = 18;
  // container.addChild(shopText);

  const shopTextSmall = new PIXI.Text(
    'Click and item to purchase it for The Hero.',
    textStyleSmall
  );
  shopTextSmall.anchor.set(0.5);
  shopTextSmall.x = 112;
  shopTextSmall.y = 18;
  container.addChild(shopTextSmall);

  const buyPotion = (): void => {
    hero.buyPotion();
  };

  const potionTexture = PIXI.Texture.from('./assets/healthPotion.png');
  const potionSprite = new PIXI.Sprite(potionTexture);
  potionSprite.anchor.set(0.5);
  potionSprite.x = 37;
  potionSprite.y = 49;
  container.addChild(potionSprite);

  potionSprite.interactive = true;
  potionSprite.buttonMode = true;

  potionSprite.on('mousedown', buyPotion).on('touchstart', buyPotion);

  const update = (delta): void => {
    // Update called by main
  };

  return { container, update };
};
