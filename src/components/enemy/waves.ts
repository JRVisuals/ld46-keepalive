// Define wave data

export type Wave = {
  name: string;
  totalEnemies: number;
  respawnCooldown: number;
  enemyDps: number;
  enemyTextureKey: string;
};

/**
 * Data for waves of enemies. Used by the enemy manager
 */
export const waves: Array<Wave> = [
  {
    name: 'Green means go!',
    totalEnemies: 7,
    respawnCooldown: 4000,
    enemyDps: 8,
    enemyTextureKey: 'CubeGreen',
    // enemies: [
    //   {
    //     spriteTexture: '',
    //     speed: 1,
    //     total: 10,
    //   },
    // ],
  },
  {
    name: "Wait. There's more?!",
    totalEnemies: 10,
    respawnCooldown: 3000,
    enemyDps: 15,
    enemyTextureKey: 'CubeOrange',
  },

  {
    name: 'How can you have any pudding?!',
    totalEnemies: 24,
    respawnCooldown: 1500,
    enemyDps: 20,
    enemyTextureKey: 'CubeBlack',
  },
];
