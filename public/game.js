// app.js
import {
  generateTerrainGrid,
  createCell,
  updateTracers,
  generateCellsGrid,
  isEmptyCell,
  updateCells
} from './objects.js';
import {
  Application,
  Container
} from './libraries/pixi.mjs'
import {
  updateDebug
} from './menu.js';
import * as menu from './menu.js';

export const app = new Application();
await app.init({
  backgroundColor: "black",
  antialias: true,
  click: true,
  eventFeatures: {
    move: false,
    globalMove: false,
    click: true,
    wheel: true,
  }
});

document.body.appendChild(app.canvas);
app.renderer.canvas.style.position = 'absolute';
app.stage.interactive = true;
menu.panelInit();

export function initialize() {
  terrainContainer.children = [];
  cellsContainer.children = [];
  tracersContainer.children = [];
  cellSize = parseFloat(document.getElementById('panelCellSize').value);
  tracersOpacityMultipler = parseFloat(document.getElementById('panelTracersOpacityMultipler').value);
  maxAge = parseFloat(document.getElementById('panelInitEnergy').value);
  maxOffsping = parseFloat(document.getElementById('panelMaxOffspring').value);

  app.renderer.resize(window.innerWidth, window.innerHeight)
  gridWidth = window.innerWidth / cellSize;
  gridHeight = window.innerHeight / cellSize;

  cells = [];
  logicTick = 0;

  generateTerrainGrid();
  generateCellsGrid();

  updateDebug();
  menu.panel.style.opacity = "1";

}

export let cellSize = 10;
document.getElementById('panelCellSize').value = cellSize;

export let gridMultiplier = 1;

export let tracersOpacityMultipler = 0.2;
document.getElementById('panelTracersOpacityMultipler').value = tracersOpacityMultipler;

export let tracersMaxOpacity = 0.9;

export let maxAge = 100;
document.getElementById('panelInitEnergy').value = maxAge;

export let maxOffsping = 2;
document.getElementById('panelMaxOffspring').value = maxOffsping;

export let targetDistanceRange = 10;
export let terrainLifeValidation = 0.6;
export let cellsRestingTime = 3;


export let logicInterval = 200;
export let logicTick = 0;
menu.panelTickSpeed.value = 2;


export let gridWidth = Math.trunc(window.innerWidth / cellSize);
export let gridHeight = Math.trunc(window.innerHeight / cellSize);

export let terrainGrid = [];
export let cells = [];
export let cellsGrid = [];

export let terrainTypeWaterValueRange = {
  start: 0,
  end: 0.64
}
export let terrainTypeSandValueRange = {
  start: terrainTypeWaterValueRange.end,
  end: 0.7
}
export let terrainTypePlainValueRange = {
  start: terrainTypeSandValueRange.end,
  end: 0.9
}
export let terrainTypeRockValueRange = {
  start: terrainTypePlainValueRange.end,
  end: 1
}

export let terrainTypeWaterColorRange = {
  start: {
    r: 0,
    g: 18,
    b: 156
  },
  end: {
    r: 0,
    g: 122,
    b: 200
  }
}
export let terrainTypeSandColorRange = {
  start: {
    r: 193,
    g: 196,
    b: 130
  },
  end: {
    r: 145,
    g: 148,
    b: 130
  }
}
export let terrainTypePlainColorRange = {
  start: {
    r: 81,
    g: 163,
    b: 72
  },
  end: {
    r: 12,
    g: 97,
    b: 12
  }
}
export let terrainTypeRockColorRange = {
  start: {
    r: 90,
    g: 90,
    b: 90
  },
  end: {
    r: 230,
    g: 230,
    b: 230
  }
}

export let terrainContainer = new Container();
export let cellsContainer = new Container();
export let tracersContainer = new Container();

app.stage.addChild(terrainContainer);
app.stage.addChild(cellsContainer);
app.stage.addChild(tracersContainer);


export let gameLogicUpdater;
app.ticker.add((time) => update_render(time));
changeLogicSpeed(menu.panelTickSpeed.value);
initialize();

function update_logic() {
  updateCells();
  updateTracers();
  updateDebug();
  logicTick++;
}


function update_render(time) {
  const delta = time.deltaTime;

}

export function changeLogicSpeed(multiplier) {
  

  if(multiplier == 0){clearInterval(gameLogicUpdater);}
    else{
  let newLogicInterval = (logicInterval / multiplier)
  gameLogicUpdater = setInterval(update_logic, newLogicInterval);}

}

app.stage.on('mousedown', (event) => {
  const x = Math.trunc(event.data.global.x / cellSize);
  const y = Math.trunc(event.data.global.y / cellSize);
  if (isEmptyCell(x, y)) createCell(x, y)
});