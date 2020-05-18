import * as PIXI from 'pixi.js';
import * as PIXIPARTICLES from 'pixi-particles';

export interface HeroParticles {
  container: PIXI.Container;
  reset: () => void;
  toggleEmitter: (forceTo?: boolean) => void;
  update: (delta: number) => void;
  setPos: (pos: { x: number; y: number }) => void;
}

interface ParticleProps {
  pos?: { x: number; y: number };
  colors?: { start: string; end: string };
}

/**
 * A container for status and particle effects on The Hero
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const heroParticles = (props: ParticleProps): HeroParticles => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'hero particles';

  let state = {};
  const initialState = { ...state };

  const { colors } = props;

  const texture = PIXI.Texture.from('./assets/particle_3x3.png');

  const colorObject = colors ? { color: colors } : {};

  const emitterConfigBase = {
    alpha: {
      start: 1,
      end: 0,
    },
    scale: {
      start: 1,
      end: 1,
      minimumScaleMultiplier: 1,
    },
    speed: {
      start: 0,
      end: 0,
      minimumSpeedMultiplier: 1,
    },
    acceleration: {
      x: 0,
      y: -64,
    },
    maxSpeed: 256,
    // startRotation: {
    //   min: 0,
    //   max: 360,
    // },
    noRotation: true,
    // rotationSpeed: {
    //   min: 0,
    //   max: 32,
    // },
    lifetime: {
      min: 0.35,
      max: 1,
    },
    blendMode: 'add',
    frequency: 0.04,
    emitterLifetime: 500,
    maxParticles: 128,
    pos: {
      x: 0,
      y: 0,
    },
    addAtBack: false,
    spawnType: 'rect',
    spawnRect: {
      x: 0,
      y: 0,
      w: 32,
      h: 64,
    },
  };

  const emitterConfig = { ...emitterConfigBase, ...colorObject };

  const emitter = new PIXIPARTICLES.Emitter(
    container,
    [texture],
    emitterConfig
  );

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
  };
  reset();

  const toggleEmitter = (forceTo?: boolean): void => {
    console.log(
      `toggle emitter (forceTo: ${forceTo}) currently: ${emitter.emit}`
    );
    if (forceTo != undefined) {
      emitter.emit = forceTo;
    } else {
      emitter.emit = !emitter.emit;
      console.table(emitter);
    }
  };

  const setPos = (pos): void => {
    emitter.updateSpawnPos(pos.x, pos.y);
  };

  const update = (delta): void => {
    // Update called by main
    emitter.update(delta * 0.025); //((now - elapsed) * 0.001);
  };

  return { container, reset, update, toggleEmitter, setPos };
};
