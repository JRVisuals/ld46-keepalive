export type ItemData = {
  type: Types;
  action: Actions;
  amount: number;
  texture: string | PIXI.Texture;
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

export const itemList: ItemData[] = [
  {
    type: Types.POTION,
    action: Actions.HEAL,
    amount: 10,
    texture: './assets/healthPotion.png',
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
    amount: 15,
    posX: 83,
    cost: 2,
    isCooling: false,
    cooldown: 5000,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: false,
  },
  {
    type: Types.POTION,
    action: Actions.SPEED,
    texture: './assets/hastePotion.png',
    amount: 5,
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
    posX: 174,
    cost: 4,
    isCooling: false,
    cooldown: 7500,
    spriteRef: null,
    cooldownSpriteRef: null,
    isAvailable: true,
  },
];
