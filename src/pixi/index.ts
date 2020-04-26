import * as PIXI from 'pixi.js';

export interface PixiConfig {
  width: number;
  height: number;
  backgroundColor: number;
  antialias: boolean;
  resolution: number;
}

const initPIXI = (
  pixiConfig: PixiConfig,
  baseElement: HTMLElement
): { pixiApp: PIXI.Application; mainContainer: PIXI.Container } => {
  const pixiApp = new PIXI.Application(pixiConfig);
  baseElement.appendChild(pixiApp.view);

  const mainContainer = new PIXI.Container();
  pixiApp.stage.addChild(mainContainer);

  return { pixiApp, mainContainer };
};

export default initPIXI;
