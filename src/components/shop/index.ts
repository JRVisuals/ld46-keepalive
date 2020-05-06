import * as PIXI from 'pixi.js';
import gsap, { Bounce, Power0 } from 'gsap';
import * as PIXISOUND from 'pixi-sound';
import { Hero } from '../hero';

import { Actions, ItemData, PotionTextureId, itemList } from './shopItems';

import { SFX_VOL_MULT } from '../../constants';

export interface ShopState {
  items: ItemData[];
}
export interface Shop {
  container: PIXI.Container;
  update: (delta: number) => void;
  animatePanel: (isAnimateIn: boolean) => void;
  reset: () => void;
}

interface Props {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
  hero: Hero;
  anims: { [key: string]: Array<PIXI.Texture> };
  potionTextures: { [TKey in PotionTextureId]: PIXI.Texture };
}

/**
 * Shop UI and logic module. Handles the display of the item shop for the hero and related animations.
 *
 * @param props - Standard component properties.  **Plus** A reference to the Hero instance, spritesheet animations for display.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const shop = (props: Props): Shop => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const targetY = pos.y;

  container.name = 'shop';

  const { hero, anims, potionTextures } = props;

  const shopState: ShopState = { items: itemList };

  // Sound bits
  const pixiSound = PIXISOUND.default;
  // Load these up on startup...
  pixiSound.add('chainsHit', './assets/chains-hit.mp3');
  pixiSound.add('chainsDown', './assets/chains.mp3');
  pixiSound.add('chainsUp', './assets/chainsUp.mp3');

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
  shopTextSmall.x = 98;
  shopTextSmall.y = 15;
  //  container.addChild(shopTextSmall);

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
        break;
      case Actions.SHIELD:
        purchaseSuccess = hero.buyPotion(itemData);
        //console.log('purchaseSuccess', purchaseSuccess);
        break;
      case Actions.SPEED:
        break;
    }
    //console.log('purchaseItem', itemData);
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
  const potionY = 58;
  const coinOffsetY = 30;
  shopState.items.map((item) => {
    // The potion itself

    const potionSprite = new PIXI.Sprite(potionTextures[item.textureId]);
    item.spriteRef = potionSprite;
    potionSprite.anchor.set(0.5);
    potionSprite.x = item.posX;
    potionSprite.y = potionY;
    container.addChild(potionSprite);

    // The cooldown hourglass

    const hourglassAnim = new PIXI.AnimatedSprite(anims.hourglass);
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
      coinsContainer.y = potionY + coinOffsetY;
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

  // Initial appearance of shoppe
  const animateIn = (): void => {
    container.y = -150;
    setTimeout(() => {
      pixiSound.play('chainsDown', {
        loop: false,
        volume: 1 * SFX_VOL_MULT,
      });
    }, 750);
    gsap.to(container, 1, {
      delay: 0.85,
      y: targetY,
      ease: Bounce.easeOut,
      onComplete: () => {
        pixiSound.play('chainsHit', {
          volume: 1 * SFX_VOL_MULT,
        });
      },
    });
  };

  const animateOut = (): void => {
    setTimeout(() => {
      pixiSound.play('chainsUp', { loop: false, volume: 1 * SFX_VOL_MULT });
    }, 1500);
    gsap.to(container, 0.5, {
      delay: 1.5,
      y: -150,
      ease: Power0.easeIn,
    });
  };

  const animatePanel = (isAnimateIn): void => {
    isAnimateIn ? animateIn() : animateOut();
  };

  const reset = (): void => {
    animatePanel(true);
  };

  const update = (delta): void => {
    // Update called by main
  };

  return { container, update, animatePanel, reset };
};
