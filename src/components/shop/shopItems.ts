export type ItemData = {
  type: Types;
  action: Actions;
  amount: number;
  texture: PIXI.Texture;
  posX: number;
  cost: number;
  cooldown: number;
  spriteRef: PIXI.Sprite | null;
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
    texture: PIXI.Texture.from(`./assets/healthPotion.png`),
    posX: 37,
    cost: 1,
    cooldown: 5000,
    spriteRef: null,
    isAvailable: true,
  },
  {
    type: Types.POTION,
    action: Actions.SHIELD,
    texture: PIXI.Texture.from(`./assets/shieldPotion.png`),
    amount: 15,
    posX: 83,
    cost: 2,
    cooldown: 5000,
    spriteRef: null,
    isAvailable: false,
  },
  {
    type: Types.POTION,
    action: Actions.SPEED,
    texture: PIXI.Texture.from(`./assets/hastePotion.png`),
    amount: 5,
    posX: 129,
    cost: 3,
    cooldown: 5000,
    spriteRef: null,
    isAvailable: false,
  },
  {
    type: Types.POTION,
    action: Actions.HEAL,
    texture: PIXI.Texture.from(`./assets/healthPotion2.png`),
    amount: 50,
    posX: 174,
    cost: 4,
    cooldown: 5000,
    spriteRef: null,
    isAvailable: true,
  },
];
