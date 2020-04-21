import * as PIXI from 'pixi.js';
import { APP_WIDTH, GROUND_MOVE_SPEED } from '../../constants';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

export const background = (props: Props): ReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const texture = PIXI.Texture.from('../../assets/ld46/bg.png');
  // const sprite = new PIXI.Sprite(texture);
  // sprite.anchor.set(0);
  // container.addChild(sprite);

  const parallaxMult = 0.2;
  const maxTile = 4;
  const tiles = [];

  for (let i = 0; i < maxTile; i++) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0);
    sprite.x = APP_WIDTH * i;
    container.addChild(sprite);
    tiles.push(sprite);
  }

  const moveTiles = (): void => {
    tiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED * parallaxMult;
      if (newX <= APP_WIDTH * -2)
        newX = APP_WIDTH * 2 - GROUND_MOVE_SPEED * parallaxMult;
      tile.x = newX;
    });
  };

  const update = (delta): void => {
    // Update called by main
    moveTiles();
  };

  return { container, update };
};
