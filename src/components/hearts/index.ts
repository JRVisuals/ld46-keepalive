import * as PIXI from 'pixi.js';
import gsap, { Bounce, Power0 } from 'gsap';

import { mapToRange } from '../../util/mapToRange';
interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  updateDisplay: (pct: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

export const hearts = (props: Props): ReturnType => {
  const HEART_FRAMES = 5;

  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;
  //container.pivot = new PIXI.Point(0.5, 0.5);
  container.pivot.x = 16;
  container.pivot.y = 16;

  // base
  const base = new PIXI.Sprite(PIXI.Texture.from(`./assets/heart_base.png`));

  // red fill (to be masked)
  const fill = new PIXI.Sprite(PIXI.Texture.from(`./assets/heart_fill.png`));
  // white fill
  const fillWhite = new PIXI.Sprite(
    PIXI.Texture.from(`./assets/heart_whitefill.png`)
  );
  fillWhite.alpha = 0;

  // mask for fill (Graphic?)
  const fillMask = new PIXI.Graphics();
  //fillMask.anchor.set(0.5);
  fillMask.beginFill(0xff00ff);
  fillMask.drawRect(0, 0, 32, 32);
  fillMask.endFill();
  fillMask.renderable = true;
  fill.mask = fillMask;
  container.addChild(fillMask);

  // outlines
  const outline = new PIXI.Sprite(
    PIXI.Texture.from(`./assets/heart_outline.png`)
  );

  container.addChild(base, fill, fillWhite, outline);

  // keep track of last percentage
  // so we know if we're increasing or decreasing for animation below
  let lastPct = 100;
  const updateDisplay = (pct: number): void => {
    const isGaining = lastPct < pct;
    lastPct = pct;
    const newX = -32 + mapToRange(pct, 0, 100, 0, 32) * 100;
    fillWhite.alpha = isGaining ? 0.5 : 1;
    container.scale.set(isGaining ? 1.2 : 0.8);
    gsap.to(fillMask, 0.25, {
      x: newX,
      ease: Bounce.easeOut,
    });
    gsap.to(fillWhite, 0.35, {
      alpha: 0,
      ease: Power0.easeOut,
    });

    gsap.to(container, 0.45, {
      pixi: { scale: 1 },
      ease: Bounce.easeOut,
    });
  };

  const update = (): void => {
    // Update called by main
  };

  return { container, update, updateDisplay };
};
