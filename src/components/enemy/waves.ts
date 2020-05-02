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
    name: 'So it begins...',
    totalEnemies: 3,
    respawnCooldown: 3000,
    enemyDps: 10,
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
    enemyTextureKey: 'CubeGreen',
  },

  {
    name: 'Cubes... take me now!',
    totalEnemies: 20,
    respawnCooldown: 1500,
    enemyDps: 20,
    enemyTextureKey: 'CubeGreen',
  },
];
