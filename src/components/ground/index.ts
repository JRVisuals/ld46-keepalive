import * as PIXI from 'pixi.js';
//import gsap from 'gsap';

import { TILE_WIDTH, GROUND_MOVE_SPEED } from '../../constants';
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

  //new PIXI.Sprite(sheet.textures["image.png"]);
  // sprite.scale.set(0.5);
  // sprite.blendMode = PIXI.BLEND_MODES.SCREEN;
  // sprite.scale.x *= -1;

  const maxTile = 16;
  const tiles = [];

  let shownSkull = false;
  for (let i = 0; i < maxTile; i++) {
    let randomTile = Math.ceil(Math.random() * groundTiles.length - 1);
    if (randomTile === 4 && shownSkull) randomTile = 0;
    if (randomTile === 4) shownSkull = true;
    console.log(randomTile);
    const sprite = new PIXI.Sprite(groundTiles[randomTile]);
    sprite.anchor.set(0.5);
    const xScale = Math.random() > 0.75 ? -1 : 1;
    sprite.scale.x = xScale;
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

  const update = (): void => {
    // Update called by main
    moveTiles();
  };

  return { container, update };
};
