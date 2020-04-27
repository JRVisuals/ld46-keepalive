import * as PIXI from 'pixi.js';
import gsap, { Bounce, Power0 } from 'gsap';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  updateDisplay: (healthPct?: number, armorPct?: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

export const hearts = (props: Props): ReturnType => {
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

  // shield icon
  const shieldIcon = new PIXI.Sprite(
    PIXI.Texture.from(`./assets/heart_shield.png`)
  );

  shieldIcon.alpha = 0;

  container.addChild(base, fill, fillWhite, outline, shieldIcon);

  // keep track of last percentage
  // so we know if we're increasing or decreasing for animation below
  let lastHealthPct = 100;
  let lastShieldPct = 0;
  const updateDisplay = (health, shield): void => {
    const isGainingHealth = lastHealthPct < health;

    lastHealthPct = health;
    lastShieldPct = shield;
    const newX = -32 + (health / 100) * 32;
    fillWhite.alpha = isGainingHealth ? 0.5 : 1;
    container.scale.set(isGainingHealth ? 1.2 : 0.8);
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

    shieldIcon.alpha = shield > 0 ? 1 : 0;
  };

  const update = (): void => {
    // Update called by main
  };

  return { container, update, updateDisplay };
};
