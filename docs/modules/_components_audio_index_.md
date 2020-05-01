[ld46](../README.md) › [Globals](../globals.md) › ["components/audio/index"](_components_audio_index_.md)

# Module: "components/audio/index"

## Index

### Interfaces

* [ReturnType](../interfaces/_components_audio_index_.returntype.md)
* [Sounds](../interfaces/_components_audio_index_.sounds.md)

### Functions

* [audio](_components_audio_index_.md#const-audio)

## Functions

### `Const` audio

▸ **audio**(`sounds`: [Sounds](../interfaces/_components_audio_index_.sounds.md)): *[ReturnType](../interfaces/_components_audio_index_.returntype.md)*

*Defined in [components/audio/index.ts:17](https://github.com/jrod-disco/ld46-keepalive/blob/5db6013/src/components/audio/index.ts#L17)*

Audio component which maps preloaded audio resources to the
default PIXISOUND class and returns functions which handle
various aspects of the audio for the game.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sounds` | [Sounds](../interfaces/_components_audio_index_.sounds.md) | an object containing a number of loader resources  |

**Returns:** *[ReturnType](../interfaces/_components_audio_index_.returntype.md)*
