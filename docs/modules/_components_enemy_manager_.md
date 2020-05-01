[ld46](../README.md) › ["components/enemy/manager"](_components_enemy_manager_.md)

# Module: "components/enemy/manager"

## Index

### Interfaces

* [ManagerProps](../interfaces/_components_enemy_manager_.managerprops.md)
* [ManagerReturnType](../interfaces/_components_enemy_manager_.managerreturntype.md)
* [State](../interfaces/_components_enemy_manager_.state.md)

### Functions

* [enemyManager](_components_enemy_manager_.md#const-enemymanager)

## Functions

### `Const` enemyManager

▸ **enemyManager**(`props`: [ManagerProps](../interfaces/_components_enemy_manager_.managerprops.md)): *[ManagerReturnType](../interfaces/_components_enemy_manager_.managerreturntype.md)*

*Defined in [components/enemy/manager.ts:39](https://github.com/jrod-disco/ld46-keepalive/blob/2baec31/src/components/enemy/manager.ts#L39)*

Manages various aspects of on-screen enemies and waves of enemies including collision detection between enemies and The Hero.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [ManagerProps](../interfaces/_components_enemy_manager_.managerprops.md) | Standard component properties. **Plus** A callback to update [waveDisplay](_components_wavedisplay_index_.md#const-wavedisplay)  |

**Returns:** *[ManagerReturnType](../interfaces/_components_enemy_manager_.managerreturntype.md)*

Interface object containing methods that can be called on this module
