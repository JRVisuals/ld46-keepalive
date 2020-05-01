[ld46](../README.md) › ["components/enemy/waves"](_components_enemy_waves_.md)

# Module: "components/enemy/waves"

## Index

### Type aliases

* [Wave](_components_enemy_waves_.md#wave)

### Variables

* [waves](_components_enemy_waves_.md#const-waves)

## Type aliases

###  Wave

Ƭ **Wave**: *object*

*Defined in [components/enemy/waves.ts:3](https://github.com/jrod-disco/ld46-keepalive/blob/2baec31/src/components/enemy/waves.ts#L3)*

#### Type declaration:

* **name**: *string*

* **respawnCooldown**: *number*

* **totalEnemies**: *number*

## Variables

### `Const` waves

• **waves**: *Array‹[Wave](_components_enemy_waves_.md#wave)›* = [
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
]

*Defined in [components/enemy/waves.ts:12](https://github.com/jrod-disco/ld46-keepalive/blob/2baec31/src/components/enemy/waves.ts#L12)*

Data for waves of enemies. Used by the enemy manager
