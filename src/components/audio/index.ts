import * as PIXISOUND from 'pixi-sound';
import gsap, { Power0 } from 'gsap';
import { MUSIC_VOL_MULT } from '../../constants';

export interface Sounds {
  MainTheme: PIXI.LoaderResource;
  Somber: PIXI.LoaderResource;
  Fanfare: PIXI.LoaderResource;
}
export interface AudioLayer {
  music: {
    mainTheme: () => void;
    somber: () => void;
    fanfare: () => void;
  };
  muteToggle: (shouldMute: boolean) => void;
}

/**
 * Audio component which maps preloaded audio resources to the
 * default PIXISOUND class and returns functions which handle
 * various aspects of the audio for the game.
 *
 * @param sounds - an object containing a number of loader resources
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const audio = (sounds: Sounds): AudioLayer => {
  // Main Music Track
  const audio = PIXISOUND.default;
  audio.add('MainTheme', sounds.MainTheme);
  audio.add('Somber', sounds.Somber);

  // Incidental Music Track
  audio.add('Fanfare', sounds.Fanfare);

  // Utility Functions
  const fadeSound = ({ sound, time, callback, vol }): void => {
    console.log('fade sound', sound);
    gsap.to(sound, time, {
      volume: vol,
      ease: Power0.easeOut,
      onComplete: () => {
        callback && callback();
      },
    });
  };

  const mainVolume = (): number => 0.5 * MUSIC_VOL_MULT;
  const menuVolume = (): number => 0.65 * MUSIC_VOL_MULT;

  // Called when we've got all the things...
  const mainTheme = (): void => {
    audio.stop('Somber');
    audio.play('MainTheme', { loop: true, volume: mainVolume() });
  };

  const somber = (): void => {
    audio.stop('MainTheme');
    audio.play('Somber', { loop: true, volume: menuVolume() });
  };

  const fanfare = (): void => {
    fadeSound({
      sound: audio.find('MainTheme'),
      time: 0.5,
      vol: 0.5 * mainVolume(),
      callback: () => {
        audio.play('Fanfare', {
          loop: false,
          volume: mainVolume(),
          complete: () => {
            fadeSound({
              sound: audio.find('MainTheme'),
              time: 0.5,
              vol: mainVolume(),
              callback: null,
            });
          },
        });
      },
    });
  };

  const muteToggle = (shouldMute: boolean): void => {
    if (shouldMute) {
      audio.muteAll();
    } else {
      audio.unmuteAll();
    }
  };

  return {
    music: { mainTheme, somber, fanfare },
    muteToggle,
  };
};
