//objects.js
import { app, cellSize, grid, gridWidth,gridHeight } from './game.js';

// Terrain template (using object destructuring for clarity)
export const templateTerrain = {
  type: String,
  difficulty: Number,
  color: String,
  pixel: null,
};

function determineTerrainType(normalizedNoise) {
  if (normalizedNoise < 0.7) {
    return 'water';
  } else if (normalizedNoise > 0.9) {
    return 'forest'; // Changed mountain to forest
  } else {
    return 'plain';
  }
}

function map(value, start1, end1, start2, end2) {
  const range1 = end1 - start1;
  const range2 = end2 - start2;
  const ratio = (value - start1) / range1;
  return start2 + (ratio * range2);
}

function generateTerrainColor(terrainType, normalizedNoise) {
  switch (terrainType) {
    case 'plain':
      // Gradient between light and dark green
      const greenStart = 128;
      const greenEnd = 255;
      const green = Math.floor(map(normalizedNoise, 0, 1, greenStart, greenEnd));
      return `rgb(0, ${green}, 0)`;
    case 'water':
      // Gradient between light and dark blue
      const blueStart = 120;
      const blueEnd = 255;
      const blue = Math.floor(map(normalizedNoise, 0, 1, blueStart, blueEnd));
      return `rgb(0, 0, ${blue})`;
    case 'forest':
      // Gradient between dark and light green
      const darkGreenStart = 22;
      const darkGreenEnd = 127;
      const darkGreen = Math.floor(map(normalizedNoise, 0, 1, darkGreenStart, darkGreenEnd));
      return `rgb(0, ${darkGreen+10}, ${darkGreen-70})`;
    default:
      console.error(`Unknown terrain type: ${terrainType}`);
      return 'rgb(0, 0, 0)';
  }
}

function generateTerrain(x, y) {
  const terrain = { ...templateTerrain };
  const noiseValue = noise.simplex2(x / 20, y / 20);
  const normalizedNoise = (noiseValue + 1) / 2;
  terrain.type = determineTerrainType(normalizedNoise);
  terrain.difficulty = Math.floor(normalizedNoise * 150); // Adjust difficulty based on noise (optional)
  console.log(terrain.difficulty)
  terrain.color = generateTerrainColor(terrain.type, normalizedNoise);
  return terrain;
}

// Terrain generation function (using object spread syntax for efficiency)
export function generateGrid() {
  noise.seed(Math.random());
  for (let i = 0; i < gridWidth; i++) {
    grid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      const terrain = generateTerrain(i, j); // Create copy using object spread
      terrain.pixel = new PIXI.Graphics(); // Create the graphics object
      terrain.pixel.rect(i * cellSize, j * cellSize, cellSize, cellSize);
      terrain.pixel.fill(terrain.color);
      app.stage.addChild(terrain.pixel);
      grid[i][j] = terrain;
    }
  }
}