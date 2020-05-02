import * as PIXI from 'pixi.js';
//import gsap from 'gsap';

import {
  GROUND_TILE_WIDTH,
  GROUND_MOVE_SPEED,
  GROUND_NO_DUPE_TILE,
} from '../../constants';
import { random } from 'gsap';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
  groundTiles: Array<PIXI.Texture>;
}

/**
 * The ground graphics and animation. Does not include background elements.
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const ground = (props: Props): ReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  const { groundTiles } = props;

  container.name = 'ground';

  const maxTile = 16;
  const tiles = [];

  let shownNoDupeTile = false;

  for (let i = 0; i < maxTile; i++) {
    let randomTile = Math.ceil(Math.random() * groundTiles.length - 1);

    // Make sure we only have one skeleton tile
    if (randomTile === GROUND_NO_DUPE_TILE && shownNoDupeTile) randomTile = 0;
    if (randomTile === GROUND_NO_DUPE_TILE) shownNoDupeTile = true;

    const sprite = new PIXI.Sprite(groundTiles[randomTile]);
    sprite.anchor.set(0.5);
    const xScale = Math.random() > 0.75 ? -1 : 1;
    sprite.scale.x = xScale;
    sprite.x = GROUND_TILE_WIDTH * i;
    container.addChild(sprite);
    tiles.push(sprite);
  }

  const moveTiles = (): void => {
    tiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED;
      if (newX <= 0) newX = maxTile * GROUND_TILE_WIDTH - GROUND_MOVE_SPEED;
      tile.x = newX;
    });
  };

  const update = (): void => {
    // Update called by main
    moveTiles();
  };

  return { container, update };
};
