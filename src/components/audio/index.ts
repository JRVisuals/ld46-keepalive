import * as PIXISOUND from 'pixi-sound';

export interface Sounds {
  MainTheme: PIXI.LoaderResource;
  Somber: PIXI.LoaderResource;
}
interface ReturnType {
  music: { mainTheme: () => void; somber: () => void };
}
/**
 * Audio component which maps preloaded audio resources to the
 * default PIXISOUND class and returns functions which handle
 * various aspects of the audio for the game.
 *
 * @param sounds - an object containing a number of loader resources
 */
export const audio = (sounds: Sounds): ReturnType => {
  const musicBed = PIXISOUND.default;
  musicBed.add('MainTheme', sounds.MainTheme);
  musicBed.add('Somber', sounds.Somber);
  // Called when we've got all the things...
  const mainTheme = (): void => {
    musicBed.stop('Somber');
    musicBed.play('MainTheme', { loop: true, volume: 0.5 });
  };

  const somber = (): void => {
    musicBed.stop('MainTheme');
    musicBed.play('Somber', { loop: true, volume: 0.65 });
  };

  return {
    music: { mainTheme, somber },
  };
};
