import * as PIXI from 'pixi.js';

export interface HeroParticles {
  container: PIXI.Container;
  reset: () => void;
  update: (delta: number) => void;
}

interface ComponentProps {
  pos?: { x: number; y: number };
}

/**
 * A container for status and particle effects on The Hero
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const heroParticles = (props: ComponentProps): HeroParticles => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'hero particles';

  let state = {};
  const initialState = { ...state };

  const particles = new PIXI.ParticleContainer();
  const totalParticles = 20;
  const texture = PIXI.Texture.from('./assets/particle_3x3.png');
  for (let i = 0; i < totalParticles; i++) {
    const sprite = new PIXI.Sprite(texture);
    particles.addChild(particles);
  }

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
  };
  reset();

  const update = (delta): void => {
    // Update called by main
  };

  return { container, reset, update };
};
