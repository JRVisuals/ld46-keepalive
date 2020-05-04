import * as PIXI from 'pixi.js';
import { APP_WIDTH, GROUND_MOVE_SPEED } from '../../constants';

interface ReturnType {
  container: PIXI.Container;
  update: (delta: number) => void;
}

interface Props {
  pos?: { x: number; y: number };
}

type MoveTiles = (props: {
  tileArray: Array<PIXI.Sprite>;
  parallaxMult: number;
  tileWidth: number;
}) => void;

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

  const maxTile = 2;
  const tileWidth = 700;

  /**  Single function to build sprite arrays
   *
   * @returns an array of sprites based on the passed in params
   *
   * */
  const buildSpriteArray = ({
    maxTile,
    tileWidth,
    texturePath,
  }): Array<PIXI.Sprite> => {
    const tempArray = [];
    for (let i = 0; i < maxTile; i++) {
      const tempTexture = PIXI.Texture.from(texturePath);
      const tempSprite = new PIXI.Sprite(tempTexture);
      tempSprite.anchor.set(0);
      tempSprite.x = tileWidth * i;
      container.addChild(tempSprite);
      tempArray.push(tempSprite);
    }
    return tempArray;
  };

  // Sky backdrop
  const skyParallaxMult = 0.0625;
  const skyTiles = buildSpriteArray({
    maxTile,
    tileWidth,
    texturePath: './assets/bg.png',
  });

  // Way background
  const bgParallaxMult = 0.125;
  const bgTiles = buildSpriteArray({
    maxTile,
    tileWidth,
    texturePath: './assets/bg_mountains.png',
  });

  // Way background clouds
  const cloudParallaxMult = 0.25;
  const cloudTiles = buildSpriteArray({
    maxTile,
    tileWidth,
    texturePath: './assets/bg_clouds.png',
  });

  // Midground rocks and stuffs
  const mgParallaxMult = 0.5;
  const mgTiles = buildSpriteArray({
    maxTile,
    tileWidth,
    texturePath: './assets/bg_rocks.png',
  });

  const moveTiles: MoveTiles = (props) => {
    const { tileArray, parallaxMult, tileWidth } = props;
    tileArray.forEach((tile) => {
      let newX = tile.x - GROUND_MOVE_SPEED * parallaxMult;
      if (newX < tileWidth * -1)
        newX = tileWidth * (maxTile - 1) - GROUND_MOVE_SPEED * parallaxMult;
      tile.x = newX;
    });
  };

  const update = (delta): void => {
    // Update called by main
    moveTiles({
      tileArray: skyTiles,
      parallaxMult: skyParallaxMult,
      tileWidth,
    });
    moveTiles({ tileArray: bgTiles, parallaxMult: bgParallaxMult, tileWidth });
    moveTiles({
      tileArray: cloudTiles,
      parallaxMult: cloudParallaxMult,
      tileWidth,
    });
    moveTiles({ tileArray: mgTiles, parallaxMult: mgParallaxMult, tileWidth });
  };

  return { container, update };
};
