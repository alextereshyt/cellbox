// app.js
import { generateGrid,createCell,updateTracers } from './objects.js'; 
import { Application,Container}from './libraries/pixi.mjs'
import { updateDebug } from './menu.js';
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

export function initialize() {
  terrainContainer.children = [];
  cellsContainer.children = [];
  tracersContainer.children = [];
  cells = [];
  cellSize = parseFloat(document.getElementById('panelCellSize').value);
  tracersOpacityMultipler =  parseFloat(document.getElementById('panelTracersOpacityMultipler').value);
  initialEnergy = parseFloat(document.getElementById('panelInitEnergy').value);
  maxOffsping = parseFloat(document.getElementById('panelMaxOffspring').value);

  app.renderer.resize(window.innerWidth, window.innerHeight)
  gridWidth = window.innerWidth/cellSize;
  gridHeight = window.innerHeight/cellSize;
  generateGrid();

}

export let cellSize = 10;
document.getElementById('panelCellSize').value = cellSize;

export let gridMultiplier = 1;

export let tracersOpacityMultipler = 0.2;
document.getElementById('panelTracersOpacityMultipler').value = tracersOpacityMultipler;

export let tracersMaxOpacity = 0.9;

export let initialEnergy = 15;
document.getElementById('panelInitEnergy').value = initialEnergy;

export let maxOffsping = 2;
document.getElementById('panelMaxOffspring').value = maxOffsping;

export let logicSpeed = 100;



export let gridWidth = Math.trunc(window.innerWidth/cellSize);
export let gridHeight = Math.trunc(window.innerHeight/cellSize);

export let grid = [];
export let cells = [];

export let terrainContainer = new Container();
export let cellsContainer = new Container();
export let tracersContainer = new Container();

app.stage.addChild(terrainContainer);
app.stage.addChild(cellsContainer);
app.stage.addChild(tracersContainer);

initialize();

function update_logic(){
for (let element of cells){
  element.update();
}
updateTracers();
updateDebug();

}


function update_render(time) {
const delta = time.deltaTime;

}

setInterval(update_logic,logicSpeed)
app.ticker.add((time) => update_render(time));

app.stage.on('mousedown', (event) => { 
  const x = Math.trunc(event.data.global.x/cellSize);
  const y = Math.trunc(event.data.global.y/cellSize);
  createCell(x,y)
});