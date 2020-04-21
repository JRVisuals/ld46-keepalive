import * as PIXI from 'pixi.js';
//import gsap from 'gsap';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  updateDisplay: (pct: number) => void;
}

interface Props {
  app?: PIXI.Application;
  pos?: { x: number; y: number };
}

export const hearts = (props: Props): ReturnType => {
  const HEART_FRAMES = 5;

  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const app = props.app ?? null;

  // Old school spritesheet
  const frames = [];
  for (let i = 1; i <= HEART_FRAMES; i++) {
    frames.push(PIXI.Texture.from(`../../assets/ld46/heart${i}.png`));
  }
  const anim = new PIXI.AnimatedSprite(frames);
  anim.gotoAndStop(0);
  anim.anchor.set(0.5);
  container.addChild(anim);

  const updateDisplay = (pct: number): void => {
    const frameToShow = Math.floor(
      pct > 0 ? HEART_FRAMES - HEART_FRAMES * pct : 4
    );
    anim.gotoAndStop(frameToShow);
  };

  const update = (delta): void => {
    // Update called by main
  };

  return { container, update, updateDisplay };
};
