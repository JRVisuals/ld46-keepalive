import * as PIXI from 'pixi.js';
import { APP_WIDTH, GROUND_MOVE_SPEED } from '../../constants';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
}
/**
 * The parallaxing background graphics and animation.
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const background = (props: Props): ReturnType => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'background';

  // Way background
  const bgTexture = PIXI.Texture.from('./assets/bg.png');
  const maxTile = 2;
  const bgParallaxMult = 0.125;
  const tileWidth = 700;
  const bgTiles = [];

  for (let i = 0; i < maxTile; i++) {
    const bgSprite = new PIXI.Sprite(bgTexture);
    bgSprite.anchor.set(0);
    bgSprite.x = tileWidth * i;
    container.addChild(bgSprite);
    bgTiles.push(bgSprite);
  }

  // Way background clouds
  const cloudTexture = PIXI.Texture.from('./assets/bg_clouds.png');

  const cloudParallaxMult = 0.25;
  const cloudTiles = [];

  for (let i = 0; i < maxTile; i++) {
    const cloudSprite = new PIXI.Sprite(cloudTexture);
    cloudSprite.anchor.set(0);
    cloudSprite.x = tileWidth * i;
    container.addChild(cloudSprite);
    cloudTiles.push(cloudSprite);
  }

  // Midground rocks and stuffs
  const bgRocksTexture = PIXI.Texture.from('./assets/bg_rocks.png');

  const mgParallaxMult = 0.5;
  const mgTiles = [];

  for (let i = 0; i < maxTile; i++) {
    const mgSprite = new PIXI.Sprite(bgRocksTexture);
    mgSprite.anchor.set(0);
    mgSprite.x = tileWidth * i;
    container.addChild(mgSprite);
    mgTiles.push(mgSprite);
  }

  const moveTiles = (): void => {
    // Way background
    bgTiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED * bgParallaxMult;
      if (newX < tileWidth * -1)
        newX = tileWidth * (maxTile - 1) - GROUND_MOVE_SPEED * bgParallaxMult;
      tile.x = newX;
    });
    // Clouds background
    cloudTiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED * cloudParallaxMult;
      if (newX < tileWidth * -1)
        newX =
          tileWidth * (maxTile - 1) - GROUND_MOVE_SPEED * cloudParallaxMult;
      tile.x = newX;
    });
    // Midground
    mgTiles.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED * mgParallaxMult;
      if (newX < tileWidth * -1)
        newX = tileWidth * (maxTile - 1) - GROUND_MOVE_SPEED * mgParallaxMult;
      tile.x = newX;
    });
  };

  const update = (delta): void => {
    // Update called by main
    moveTiles();
  };

  return { container, update };
};
