// app.js
import { generateGrid,createCell,updateTracers } from './objects.js'; 
import { Application,Container}from './libraries/pixi.mjs'
import * as menu from './menu.js';

export const app = new Application();
await app.init({
  backgroundColor: "black",
  antialias: true,
  click: true,
});
app.renderer.resize(window.innerWidth,window.innerHeight)
app.renderer.canvas.style.position = 'absolute';
app.stage.interactive = true;
document.body.appendChild(app.canvas);

export const cellSize = 10;
export const gridMultiplier = 1;
export const tracersOpacityMultipler = 0.2;
export const tracersMaxOpacity = 0.9;
export const initialEnergy = 20;
export const maxOffsping = 2;


export const gridWidth = window.innerWidth/cellSize;
export const gridHeight = window.innerHeight/cellSize;

export const terrainContainer = new Container();
export const cellsContainer = new Container();
export const tracersContainer = new Container();

app.stage.addChild(terrainContainer);
app.stage.addChild(cellsContainer);
app.stage.addChild(tracersContainer);

export const grid = [];
export const cells = [];


generateGrid();

function update_logic(){
cells.forEach(element => {
  element.update();
});
updateTracers();
// console.log(tracersContainer.children.length)
// console.log(cells.length)
// console.log("\n")

}


function update_render(time) {
const delta = time.deltaTime;

}

setInterval(update_logic,1)
app.ticker.add((time) => update_render(time));

app.stage.on('mousedown', (event) => { 
  const x = Math.trunc(event.data.global.x/cellSize);
  const y = Math.trunc(event.data.global.y/cellSize);
  createCell(x,y)
});