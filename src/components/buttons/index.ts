import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';

export interface Button {
  container: PIXI.Container;
  setEnabled: (isEnabled: boolean) => void;
}

interface Props {
  onPress: () => void;
  pos?: { x: number; y: number };
}

/**
 * Play Again button
 *
 * @param props - Standard component properties. **Plus** the `onPress` callback.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const btnAgain = (props: Props): Button => {
  const { onPress } = props;
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'btnAgain';

  const texture = PIXI.Texture.from('./assets/btn_again.png');
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.interactive = false;
  sprite.buttonMode = true;
  container.alpha = 0;
  sprite.on('mousedown', onPress).on('touchstart', onPress);

  container.addChild(sprite);

  const setEnabled = (isEnabled: boolean): void => {
    if (isEnabled) {
      container.alpha = 0;
      container.y = pos.y + 10;
      gsap.to(container, 0.2, {
        delay: 1.75,
        alpha: 1,
        y: pos.y,
        ease: Power0.easeOut,
        onComplete: () => {
          sprite.interactive = true;
        },
      });
    } else {
      //container.alpha = 1;
      container.y = pos.y;
      gsap.to(container, 0.2, {
        alpha: 0,
        y: pos.y + 10,
        ease: Power0.easeIn,
        onComplete: () => {
          sprite.interactive = false;
        },
      });
    }
  };

  return { container, setEnabled };
};
