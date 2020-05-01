[ld46](../README.md) › [Globals](../globals.md) › ["main"](_main_.md)

# Module: "main"

## Index

### Interfaces

* [BootstrapApp](../interfaces/_main_.bootstrapapp.md)

### Type aliases

* [Animations](_main_.md#animations)

### Variables

* [hostDiv](_main_.md#const-hostdiv)
* [hostHeight](_main_.md#const-hostheight)
* [hostWidth](_main_.md#const-hostwidth)
* [preloader](_main_.md#const-preloader)

### Functions

* [bootstrapApp](_main_.md#const-bootstrapapp)
* [onAssetsLoaded](_main_.md#const-onassetsloaded)

### Object literals

* [pixiConfig](_main_.md#const-pixiconfig)

## Type aliases

###  Animations

Ƭ **Animations**: *object*

*Defined in [main.ts:33](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L33)*

#### Type declaration:

* **hourglass**: *Spritesheet | null*

## Variables

### `Const` hostDiv

• **hostDiv**: *HTMLElement* = document.getElementById('canvas')

*Defined in [main.ts:20](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L20)*

___

### `Const` hostHeight

• **hostHeight**: *number* = APP_WIDTH * (APP_HEIGHT / APP_WIDTH)

*Defined in [main.ts:22](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L22)*

___

### `Const` hostWidth

• **hostWidth**: *350* = APP_WIDTH

*Defined in [main.ts:21](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L21)*

___

### `Const` preloader

• **preloader**: *Loader‹›* = PIXI.Loader.shared

*Defined in [main.ts:60](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L60)*

## Functions

### `Const` bootstrapApp

▸ **bootstrapApp**(`props`: object): *[BootstrapApp](../interfaces/_main_.bootstrapapp.md)*

*Defined in [main.ts:71](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L71)*

**Parameters:**

▪ **props**: *object*

Name | Type |
------ | ------ |
`animations` | [Animations](_main_.md#animations) |
`sounds` | [Sounds](../interfaces/_components_audio_index_.sounds.md) |

**Returns:** *[BootstrapApp](../interfaces/_main_.bootstrapapp.md)*

___

### `Const` onAssetsLoaded

▸ **onAssetsLoaded**(): *void*

*Defined in [main.ts:40](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L40)*

**Returns:** *void*

## Object literals

### `Const` pixiConfig

### ▪ **pixiConfig**: *object*

*Defined in [main.ts:23](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L23)*

###  antialias

• **antialias**: *false* = false

*Defined in [main.ts:27](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L27)*

###  backgroundColor

• **backgroundColor**: *number* = 2632756

*Defined in [main.ts:26](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L26)*

###  height

• **height**: *number* = hostHeight

*Defined in [main.ts:25](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L25)*

###  resolution

• **resolution**: *number* = 3

*Defined in [main.ts:28](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L28)*

###  width

• **width**: *number* = hostWidth

*Defined in [main.ts:24](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/main.ts#L24)*
