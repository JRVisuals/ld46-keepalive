[ld46](../README.md) › [Globals](../globals.md) › ["components/shop/shopItems"](_components_shop_shopitems_.md)

# Module: "components/shop/shopItems"

## Index

### Enumerations

* [Actions](../enums/_components_shop_shopitems_.actions.md)
* [Types](../enums/_components_shop_shopitems_.types.md)

### Type aliases

* [ItemData](_components_shop_shopitems_.md#itemdata)

### Variables

* [itemList](_components_shop_shopitems_.md#const-itemlist)

## Type aliases

###  ItemData

Ƭ **ItemData**: *object*

*Defined in [components/shop/shopItems.ts:1](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/components/shop/shopItems.ts#L1)*

#### Type declaration:

* **action**: *[Actions](../enums/_components_shop_shopitems_.actions.md)*

* **amount**: *number*

* **cooldown**: *number*

* **cooldownSpriteRef**: *AnimatedSprite | null*

* **cost**: *number*

* **duration**: *number | null*

* **isAvailable**: *boolean*

* **isCooling**: *boolean*

* **posX**: *number*

* **spriteRef**: *Sprite | null*

* **texture**: *string | Texture*

* **type**: *[Types](../enums/_components_shop_shopitems_.types.md)*

## Variables

### `Const` itemList

• **itemList**: *[ItemData](_components_shop_shopitems_.md#itemdata)[]* = [
  {
    type: Types.POTION,
    action: Actions.HEAL,
    texture: './assets/healthPotion.png',
    amount: 10,
    duration: null,
    posX: 37,
    cost: 1,
    isCooling: false,
    cooldown: 2500,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: true,
  },
  {
    type: Types.POTION,
    action: Actions.SHIELD,
    texture: './assets/shieldPotion.png',
    amount: 30, // gives shield which takes damage before health
    duration: 10000,
    posX: 83,
    cost: 2,
    isCooling: false,
    cooldown: 5000,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: true,
  },
  {
    type: Types.POTION,
    action: Actions.SPEED,
    texture: './assets/hastePotion.png',
    amount: 5,
    duration: 5000,
    posX: 129,
    cost: 3,
    isCooling: false,
    cooldown: 5000,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: false,
  },
  {
    type: Types.POTION,
    action: Actions.HEAL,
    texture: './assets/healthPotion2.png',
    amount: 50,
    duration: null,
    posX: 174,
    cost: 4,
    isCooling: false,
    cooldown: 7500,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: true,
  },
]

*Defined in [components/shop/shopItems.ts:25](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/components/shop/shopItems.ts#L25)*
