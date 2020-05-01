[ld46](../README.md) › ["components/hero/index"](_components_hero_index_.md)

# Module: "components/hero/index"

## Index

### Enumerations

* [STATUS](../enums/_components_hero_index_.status.md)

### Interfaces

* [Hero](../interfaces/_components_hero_index_.hero.md)
* [HeroState](../interfaces/_components_hero_index_.herostate.md)
* [Props](../interfaces/_components_hero_index_.props.md)

### Functions

* [hero](_components_hero_index_.md#const-hero)

## Functions

### `Const` hero

▸ **hero**(`props`: [Props](../interfaces/_components_background_index_.props.md)): *[Hero](../interfaces/_components_hero_index_.hero.md)*

*Defined in [components/hero/index.ts:64](https://github.com/jrod-disco/ld46-keepalive/blob/2baec31/src/components/hero/index.ts#L64)*

**Our Hero.** Handles all of the hero display and logic other than external items like [heroNumbers](_components_heronumbers_index_.md#const-heronumbers), [hpDisplay](../interfaces/_components_hero_index_.props.md#hpdisplay), [coinDisplay](../interfaces/_components_hero_index_.props.md#coindisplay), etc.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [Props](../interfaces/_components_background_index_.props.md) | Standard component properties. **Plus** References and callbacks to external modules.  |

**Returns:** *[Hero](../interfaces/_components_hero_index_.hero.md)*

Interface object containing methods that can be called on this module
