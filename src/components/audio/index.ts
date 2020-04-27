import * as PIXISOUND from 'pixi-sound';

interface ReturnType {
  music: { mainTheme: () => void; somber: () => void };
}
export const audio = (): ReturnType => {
  const musicBed = PIXISOUND.default;

  // Load these up on startup...
  musicBed.add('MainTheme', './assets/KeepYeAlive_MainRiff.mp3');
  musicBed.add('Somber', './assets/KeepYeAlive_Somber.mp3');
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
