// app.js
import { generateGrid } from './objects.js'; 

export const app = new PIXI.Application();
await app.init({
  backgroundColor: "white",
  antialias: true
});
app.renderer.resize(window.innerWidth,window.innerHeight)
app.renderer.canvas.style.position = 'absolute';

document.body.appendChild(app.canvas);
export const cellSize = 20;
export const gridWidth = window.innerWidth/cellSize;
export const gridHeight = window.innerHeight/cellSize;

console.log(window.innerWidth + " " + window.innerHeight)

export const grid = [];

function update() {
  // Add your update logic here (e.g., handle user input, animation)
}

generateGrid();

app.ticker.add(update);