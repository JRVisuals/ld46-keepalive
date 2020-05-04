// Define wave data

export type WaveEnemy = {
  enemySpeed: number;
  enemyDps: number;
  enemyTextureKey: string;
  weight?: number;
};

export type Wave = {
  name: string;
  totalEnemies: number;
  respawnCooldown: number;
  enemies: Array<WaveEnemy>;
};

/**
 * Data for waves of enemies. Used by the enemy manager
 */
export const waves: Array<Wave> = [
  {
    // Wave Based
    name: 'Green means go!',
    totalEnemies: 5,
    respawnCooldown: 4000,
    // Specific to Enemy
    enemies: [{ enemySpeed: 1.25, enemyDps: 10, enemyTextureKey: 'CubeGreen' }],
  },
  {
    name: "Wait. There's more?!",
    totalEnemies: 10,
    respawnCooldown: 1250,
    enemies: [
      {
        enemySpeed: 1.25,
        enemyDps: 10,
        enemyTextureKey: 'CubeGreen',
        weight: 0.75,
      },
      {
        enemySpeed: 1.5,
        enemyDps: 5,
        enemyTextureKey: 'CubeOrange',
        weight: 0.25,
      },
    ],
  },
  {
    name: 'An orange menace!',
    totalEnemies: 10,
    respawnCooldown: 1250,
    enemies: [{ enemySpeed: 1.5, enemyDps: 5, enemyTextureKey: 'CubeOrange' }],
  },
  {
    name: "If you don't eat your meat...",
    totalEnemies: 15,
    respawnCooldown: 2500,
    enemies: [
      {
        enemySpeed: 1.25,
        enemyDps: 10,
        enemyTextureKey: 'CubeGreen',
        weight: 0.25,
      },
      {
        enemySpeed: 1.5,
        enemyDps: 5,
        enemyTextureKey: 'CubeOrange',
        weight: 0.5,
      },
      {
        enemySpeed: 1.1,
        enemyDps: 25,
        enemyTextureKey: 'CubeBlack',
        weight: 0.25,
      },
    ],
  },
  {
    name: 'How can you have any pudding?!',
    totalEnemies: 24,
    respawnCooldown: 2000,
    enemies: [{ enemySpeed: 1.2, enemyDps: 25, enemyTextureKey: 'CubeBlack' }],
  },
];
