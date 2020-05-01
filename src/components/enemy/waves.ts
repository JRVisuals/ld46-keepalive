// Define wave data

export type Wave = {
  name: string;
  totalEnemies: number;
  respawnCooldown: number;
};

/**
 * Data for waves of enemies. Used by the enemy manager
 */
export const waves: Array<Wave> = [
  {
    name: 'So it begins...',
    totalEnemies: 3,
    respawnCooldown: 3000,
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
  },

  {
    name: 'Cubes... take me now!',
    totalEnemies: 20,
    respawnCooldown: 1500,
  },
];
