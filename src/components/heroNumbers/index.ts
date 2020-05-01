import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';

export interface HeroNumbers {
  container: PIXI.Container;
  update: (delta: number) => void;
  animateNumbers: (props: { damageDone: number; isHealing: boolean }) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

/**
 * Damage an healing numbers displayed above the hero. Called by the {@link Hero} module when the hero takes damage or heals.
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const heroNumbers = (props: Props): HeroNumbers => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'heroNumbers';

  // Text
  const style = {
    fontFamily: 'Impact, Charcoal, sans-serif',
    fontSize: 14,
    fontWeight: 'bold',
    fill: ['#BB0000'],
    fillGradientType: 1,
    fillGradientStops: [0.35],
    dropShadow: true,
    dropShadowColor: '#550000',
    dropShadowBlur: 10,
    dropShadowDistance: 0,
  };
  const textStyle = new PIXI.TextStyle(style);

  const textStyleAlt = new PIXI.TextStyle({
    ...style,
    fill: ['#CCCCCC'],
    dropShadowColor: '#005500',
  });

  const healthStartY = -20;

  const animateNumbers = ({ damageDone, isHealing }): void => {
    const healthText = isHealing
      ? new PIXI.Text('FOO', textStyleAlt)
      : new PIXI.Text('FOO', textStyle);
    healthText.anchor.set(0.5);
    healthText.x = 0;
    healthText.y = healthStartY;
    healthText.alpha = 0;

    container.addChild(healthText);

    const displayText = isHealing
      ? `+${String(damageDone)}`
      : `-${String(damageDone)}`;
    healthText.text = displayText;
    healthText.alpha = 0;
    healthText.y = healthStartY;
    gsap.to(healthText, 0.3, {
      alpha: 1,
      ease: Power0.easeIn,
      onComplete: () => {
        gsap.to(healthText, 0.3, {
          alpha: 0,
          ease: Power0.easeOut,
          onComplete: () => {
            container.removeChild(healthText);
          },
        });
      },
    });

    gsap.to(healthText, 0.3, {
      y: healthStartY - 40,
      ease: Power0.easeOut,
    });
  };

  const update = (delta): void => {
    // Update called by main
  };

  return { container, update, animateNumbers };
};
