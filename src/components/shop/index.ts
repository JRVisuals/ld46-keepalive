import * as PIXI from 'pixi.js';
import gsap, { Bounce, Power0 } from 'gsap';

import { Hero } from '../hero';

import { Actions, ItemData, itemList } from './shopItems';

export interface ShopState {
  items: ItemData[];
}
export interface Shop {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
  hero: Hero;
  anims: { hourglass: PIXI.Spritesheet };
}

export const shop = (props: Props): Shop => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const { hero, anims } = props;

  const shopState: ShopState = { items: itemList };

  const texture = PIXI.Texture.from('./assets/shopPanel.png');
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0);
  container.addChild(sprite);

  console.log('anims', anims);

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
  shopTextSmall.x = 98;
  shopTextSmall.y = 15;
  container.addChild(shopTextSmall);

  // Called after an item is purchased and its cooldonw timeout is called
  const coolDownOver = (itemData: ItemData): void => {
    gsap.to(itemData.cooldownSpriteRef, 0.3, {
      delay: 0.3,
      alpha: 0,
      ease: Power0.easeOut,
      onComplete: () => {
        itemData.cooldownSpriteRef.stop();
      },
    });

    gsap.to(itemData.spriteRef, 0.3, {
      delay: 0.3,
      alpha: 1,
      ease: Power0.easeOut,
      onComplete: () => {
        itemData.isCooling = false;
        itemData.spriteRef.interactive = true;
      },
    });
  };

  // Called when someone clicks an item in the shop
  const purchaseItem = (itemData: ItemData): void => {
    // Bail if item is on cooldown
    if (itemData.isCooling) return;
    // Do things based on the item action value
    let purchaseSuccess = false;
    switch (itemData.action) {
      case Actions.HEAL:
        purchaseSuccess = hero.buyPotion(itemData);
        console.log('purchaseSuccess', purchaseSuccess);
        break;
      case Actions.SHIELD:
        break;
      case Actions.SPEED:
        break;
    }
    console.log('purchaseItem', itemData);
    // Animate bottle depending on success
    const currentX = itemData.spriteRef.x;
    if (purchaseSuccess) {
      itemData.isCooling = true;
      itemData.spriteRef.interactive = false;
      itemData.cooldownSpriteRef.play();
      gsap.to(itemData.cooldownSpriteRef, 0.3, {
        delay: 0.3,
        alpha: 1,
        ease: Power0.easeOut,
      });
      setTimeout(() => {
        coolDownOver(itemData);
      }, itemData.cooldown);
      itemData.spriteRef.alpha = 1;
      gsap.to(itemData.spriteRef, 0.2, {
        alpha: 0,
        x: itemData.posX - 20,
        ease: Power0.easeIn,
        onComplete: () => {
          itemData.spriteRef.x = itemData.posX;
        },
      });
    } else {
      itemData.spriteRef.x = itemData.posX - 5;
      gsap.to(itemData.spriteRef, 0.3, {
        x: currentX,
        ease: Bounce.easeOut,
        onComplete: () => {
          itemData.spriteRef.x = itemData.posX;
        },
      });
    }
  };

  // Display Potions in Shoppe
  const potionY = 50;
  shopState.items.map((item) => {
    // The potion itself

    const potionTexture =
      typeof item.texture === 'string'
        ? PIXI.Texture.from(item.texture)
        : item.texture;

    const potionSprite = new PIXI.Sprite(potionTexture);
    item.spriteRef = potionSprite;
    potionSprite.anchor.set(0.5);
    potionSprite.x = item.posX;
    potionSprite.y = potionY;
    container.addChild(potionSprite);

    // The cooldown hourglass

    const hourglassAnim = new PIXI.AnimatedSprite(
      anims.hourglass.animations['hourglass']
    );
    item.cooldownSpriteRef = hourglassAnim;
    hourglassAnim.x = item.posX + 1;
    hourglassAnim.y = potionY + 7;
    hourglassAnim.anchor.set(0.5);
    hourglassAnim.animationSpeed = 0.1;
    container.addChild(hourglassAnim);
    hourglassAnim.alpha = 0;

    if (item.isAvailable) {
      potionSprite.interactive = true;
      potionSprite.buttonMode = true;
      potionSprite
        .on('mousedown', () => {
          purchaseItem(item);
        })
        .on('touchstart', () => {
          purchaseItem(item);
        });
      // The coins below
      const coinsContainer = new PIXI.Container();
      coinsContainer.x = item.posX;
      coinsContainer.y = potionY + 35;
      container.addChild(coinsContainer);
      for (let i = 0; i < item.cost; i++) {
        const shopCoinTex = PIXI.Texture.from('./assets/shopCoin.png');
        const shopCoinSprite = new PIXI.Sprite(shopCoinTex);
        shopCoinSprite.anchor.set(0.5);
        shopCoinSprite.x = 10 * i - (item.cost - 1) * 5;
        coinsContainer.addChild(shopCoinSprite);
      }
    } else {
      potionSprite.alpha = 0.35;
    }
  });

  const update = (delta): void => {
    // Update called by main
  };

  return { container, update };
};
