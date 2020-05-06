export type ItemData = {
  type: Types;
  action: Actions;
  amount: number;
  duration: number | null; // how long does this effect last if it isn't a one shot
  textureId: string;
  posX: number;
  cost: number;
  isCooling: boolean;
  cooldown: number;
  spriteRef: PIXI.Sprite | null;
  cooldownSpriteRef: PIXI.AnimatedSprite | null;
  isAvailable: boolean;
};

export enum Types {
  POTION,
}
export enum Actions {
  HEAL,
  SHIELD,
  SPEED,
}
export enum PotionTextureId {
  HEALTH_SMALL = 'healthSmall',
  HEALTH_LARGE = 'healthLarge',
  HASTE_LARGE = 'hasteLarge',
  SHIELD_SMALL = 'shieldSmall',
}

/**
 * Data for items available in the shoppe
 */
export const itemList: ItemData[] = [
  {
    type: Types.POTION,
    action: Actions.HEAL,
    textureId: PotionTextureId.HEALTH_SMALL,
    amount: 10,
    duration: null,
    posX: 40,
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
    textureId: PotionTextureId.SHIELD_SMALL,
    amount: 30,
    duration: 10000,
    posX: 86,
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
    textureId: PotionTextureId.HASTE_LARGE,
    amount: 5,
    duration: 5000,
    posX: 132,
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
    textureId: PotionTextureId.HEALTH_LARGE,
    amount: 50,
    duration: null,
    posX: 177,
    cost: 4,
    isCooling: false,
    cooldown: 7500,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: true,
  },
];
