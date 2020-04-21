import * as PIXI from 'pixi.js';
//import gsap from 'gsap';

import { TILE_WIDTH, GROUND_MOVE_SPEED } from '../../constants';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

export const ground = (props: Props): ReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const texture = PIXI.Texture.from('./assets/groundTile.png');

  // sprite.scale.set(0.5);
  // sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  // sprite.scale.x *= -1;

  const maxTile = 8;
  const tiles = [];

  for (let i = 0; i < maxTile; i++) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = TILE_WIDTH * i;
    container.addChild(sprite);
    tiles.push(sprite);
  }

  const moveTiles = (): void => {
    tiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED;
      if (newX <= 0) newX = maxTile * TILE_WIDTH - GROUND_MOVE_SPEED;
      tile.x = newX;
    });
  };

  const update = (delta): void => {
    // Update called by main
    moveTiles();
  };

  return { container, update };
};
