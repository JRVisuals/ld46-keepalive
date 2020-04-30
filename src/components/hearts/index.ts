import * as PIXI from 'pixi.js';
import gsap, { Bounce, Power0 } from 'gsap';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
  updateDisplay: (props: {
    health?: number;
    shield?: number;
    shieldTimeRemaining?: number;
  }) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

export const hearts = (props: Props): ReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'hearts';

  container.pivot.x = 16;
  container.pivot.y = 16;

  let shieldTween;
  let lowShieldTriggered = false;

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
  shieldIcon.x = shieldIcon.y = 16;
  shieldIcon.anchor.set(0.5);

  shieldIcon.alpha = 0;

  container.addChild(base, fill, fillWhite, outline, shieldIcon);

  const triggerLowShieldWarning = (): void => {
    if (!lowShieldTriggered) {
      lowShieldTriggered = true;
      shieldTween = gsap.to(shieldIcon, 0.2, {
        pixi: { alpha: 0.65 },
        ease: Power0.easeInOut,
        yoyo: true,
        repeat: -1,
      });
    }
  };

  // keep track of last percentage
  // so we know if we're increasing or decreasing for animation below
  let lastHealthPct = 100;
  let lastShieldPct = 0;

  const updateDisplay = ({
    health = null,
    shield = null,
    shieldTimeRemaining = null,
  }): void => {
    if (shieldTimeRemaining && shieldTimeRemaining <= 3000) {
      triggerLowShieldWarning();
      return;
    }

    const isGainingHealth = lastHealthPct < health;
    const isGainingShield = lastShieldPct < shield;

    lastHealthPct = health;
    lastShieldPct = shield;

    if (isGainingShield) {
      lowShieldTriggered = false;
      shieldTween?.kill();
    }

    if (shield && !isGainingHealth) {
      shieldIcon.scale.set(0.6);
      gsap.to(shieldIcon, 0.45, {
        pixi: { scale: 1 },
        ease: Bounce.easeOut,
      });
      fillWhite.alpha = 1;
      gsap.to(fillWhite, 0.35, {
        alpha: 0,
        ease: Power0.easeOut,
      });
    } else {
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
    }

    if (shield === 0) {
      lowShieldTriggered = false;
      shieldTween?.kill();
    }
    shieldIcon.alpha = shield > 0 ? 1 : 0;
  };

  const update = (): void => {
    // Update called by main
  };

  return { container, update, updateDisplay };
};
