import * as PIXI from 'pixi.js';
//import gsap from 'gsap';

import {
  GROUND_TILE_WIDTH,
  GROUND_MOVE_SPEED,
  GROUND_NO_DUPE_TILE,
  GROUND_TOTAL_TILES,
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

  const tiles = [];

  let shownNoDupeTile = false;
  let prevTile = -1;
  for (let i = 0; i < GROUND_TOTAL_TILES; i++) {
    let randomTile = Math.ceil(Math.random() * groundTiles.length - 1);

    // Make sure we only have one skeleton tile
    if (randomTile === GROUND_NO_DUPE_TILE && shownNoDupeTile) randomTile = 0;
    if (randomTile === GROUND_NO_DUPE_TILE) shownNoDupeTile = true;
    // No twinsies
    if (randomTile === prevTile)
      randomTile =
        randomTile + 1 < groundTiles.length - 1
          ? randomTile + 1
          : randomTile - 1;
    prevTile = randomTile;

    const sprite = new PIXI.Sprite(groundTiles[randomTile]);
    sprite.name = `ground ${randomTile}`;
    sprite.anchor.set(0);
    // const xScale = Math.random() > 0.75 ? -1 : 1;
    // sprite.scale.x = xScale;
    sprite.x = GROUND_TILE_WIDTH * i;
    sprite.y = GROUND_TILE_WIDTH * -0.5;
    container.addChild(sprite);
    tiles.push(sprite);
  }

  const moveTiles = (): void => {
    tiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED;
      if (newX < 0)
        newX = GROUND_TOTAL_TILES * GROUND_TILE_WIDTH - GROUND_MOVE_SPEED;
      tile.x = newX;
    });
  };

  const update = (): void => {
    // Update called by main
    moveTiles();
  };

  return { container, update };
};
