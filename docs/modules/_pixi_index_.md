[ld46](../README.md) › ["pixi/index"](_pixi_index_.md)

# Module: "pixi/index"

## Index

### Interfaces

* [PixiConfig](../interfaces/_pixi_index_.pixiconfig.md)

### Functions

* [initPIXI](_pixi_index_.md#const-initpixi)

## Functions

### `Const` initPIXI

▸ **initPIXI**(`pixiConfig`: [PixiConfig](../interfaces/_pixi_index_.pixiconfig.md), `baseElement`: HTMLElement): *object*

*Defined in [pixi/index.ts:18](https://github.com/jrod-disco/ld46-keepalive/blob/2baec31/src/pixi/index.ts#L18)*

Initializes the PIXI container and adds it to the DOM.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pixiConfig` | [PixiConfig](../interfaces/_pixi_index_.pixiconfig.md) | PIXI configuration object |
`baseElement` | HTMLElement | DOM element to add PIXI canvas to   |

**Returns:** *object*

* **mainContainer**: *Container*

* **pixiApp**: *Application*
