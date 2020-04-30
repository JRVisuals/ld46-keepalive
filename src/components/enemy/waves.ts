// Define wave data

export type Wave = {
  name: string;
  duration: number;
  totalEnemies: number;
  respawnCooldown: number;
};

export const waves: Array<Wave> = [
  {
    name: 'First Wave',
    duration: 10000,
    totalEnemies: 5,
    respawnCooldown: 6000,
    // enemies: [
    //   {
    //     spriteTexture: '',
    //     speed: 1,
    //     total: 10,
    //   },
    // ],
  },
  {
    name: 'Second Wave',
    duration: 15000,
    totalEnemies: 10,
    respawnCooldown: 3000,
  },

  {
    name: 'Final Wave',
    duration: 15000,
    totalEnemies: 20,
    respawnCooldown: 1500,
  },
];
