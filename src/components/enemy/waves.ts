// Define wave data

export type WaveEnemy = {
  enemySpeed: number;
  enemyDps: number;
  enemyTextureKey: string;
  weight?: number;
  coinsDropped: number;
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
    enemies: [
      {
        enemySpeed: 1.25,
        enemyDps: 10,
        enemyTextureKey: 'CubeGreen',
        coinsDropped: 1,
      },
    ],
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
        coinsDropped: 1,
      },
      {
        enemySpeed: 1.5,
        enemyDps: 5,
        enemyTextureKey: 'CubeOrange',
        weight: 0.25,
        coinsDropped: 2,
      },
    ],
  },
  {
    name: 'An orange menace!',
    totalEnemies: 10,
    respawnCooldown: 1250,
    enemies: [
      {
        enemySpeed: 1.5,
        enemyDps: 5,
        enemyTextureKey: 'CubeOrange',
        coinsDropped: 2,
      },
    ],
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
        coinsDropped: 1,
      },
      {
        enemySpeed: 1.5,
        enemyDps: 5,
        enemyTextureKey: 'CubeOrange',
        weight: 0.5,
        coinsDropped: 2,
      },
      {
        enemySpeed: 1.1,
        enemyDps: 25,
        enemyTextureKey: 'CubeBlack',
        weight: 0.25,
        coinsDropped: 3,
      },
    ],
  },
  {
    name: 'How can you have any pudding?!',
    totalEnemies: 20,
    respawnCooldown: 2000,
    enemies: [
      {
        enemySpeed: 1.2,
        enemyDps: 25,
        enemyTextureKey: 'CubeBlack',
        coinsDropped: 3,
      },
    ],
  },
  {
    name: 'Endless Wave!!!',
    totalEnemies: 24,
    respawnCooldown: 1800,
    enemies: [
      {
        enemySpeed: 1.2,
        enemyDps: 25,
        enemyTextureKey: 'CubeBlack',
        coinsDropped: 3,
        weight: 0.7,
      },
      {
        enemySpeed: 1.25,
        enemyDps: 10,
        enemyTextureKey: 'CubeGreen',
        weight: 0.15,
        coinsDropped: 1,
      },
      {
        enemySpeed: 1.5,
        enemyDps: 5,
        enemyTextureKey: 'CubeOrange',
        weight: 0.15,
        coinsDropped: 2,
      },
    ],
  },
];
