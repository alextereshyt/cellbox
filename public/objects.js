//objects.js
import {
  cellSize,
  grid,
  gridWidth,
  gridHeight,
  cells,
  terrainContainer,
  cellsContainer,
  tracersContainer,
  gridMultiplier,
  tracersOpacityMultipler,
  tracersMaxOpacity,
  initialEnergy,
  maxOffsping
} from './game.js';
import {
  Graphics
} from './libraries/pixi.mjs'


// Terrain template (using object destructuring for clarity)
export const templateTerrain = {
  type: String,
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
  const terrain = {
    ...templateTerrain
  };
  const noiseValue = noise.simplex2(x / 20, y / 20);
  const normalizedNoise = (noiseValue + 1) / 2;
  terrain.type = determineTerrainType(normalizedNoise);
  terrain.color = generateTerrainColor(terrain.type, normalizedNoise);
  return terrain;
}

export function generateGrid() {
  noise.seed(Math.random());
  for (let i = 0; i < gridWidth; i++) {
    grid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      const terrain = generateTerrain(i, j); // Create copy using object spread
      terrain.pixel = new Graphics(); // Create the graphics object
      terrain.pixel.rect(i * cellSize, j * cellSize, cellSize * gridMultiplier, cellSize * gridMultiplier);
      terrain.pixel.fill(terrain.color);
      terrainContainer.addChild(terrain.pixel);
      grid[i][j] = terrain;
    }
  }
}

export function isEmptyCell(x, y) {
  let isEmpty = true;
  cells.forEach(element => {
    if (element.x == x && element.y == y)
      isEmpty = false;
  });
  return isEmpty;
}

export function randomOffset() {
  const offset = Math.floor(Math.random() * 4); // Choose a random direction (up, down, left, right)
  const newX = (offset === 0 ? -1 : offset === 2 ? 1 : 0);
  const newY = (offset === 1 ? -1 : offset === 3 ? 1 : 0);
  return {
    x: newX,
    y: newY
  }
}

export const templateCell = {
  x: Number,
  y: Number,
  state: String,
  color: String,
  graphics: null,
  energy: Number,
  offspring: Number,
  update: function () {

    if (!this.energy) {
      this.state = "dead"
    } else if (!this.offspring) {
      this.state = "resting"
    } else if (grid[this.x][this.y].type == 'plain') {
      this.state = "reproduction";
    }

    switch (this.state) {
      case "wandering":

        const direction = randomOffset();
        if (direction.x + this.x >= 0 && direction.x + this.x < gridWidth &&
          direction.y + this.y >= 0 && direction.y + this.y < gridHeight &&
          isEmptyCell(direction.x + this.x, direction.y + this.y) &&
          this.energy
        ) {
          this.x = direction.x + this.x;
          this.y = direction.y + this.y;
          this.graphics.x = this.x * cellSize;
          this.graphics.y = this.y * cellSize;
          this.energy--
        }

        break;

      case "resting":
        this.energy--;
        break;

      case "reproduction":
        const offset = randomOffset()
        if (isEmptyCell(offset.x + this.x, offset.y + this.y) &&
          offset.x + this.x >= 0 && offset.x + this.x < gridWidth &&
          offset.y + this.y >= 0 && offset.y + this.y < gridHeight
        ) {
          createCell(offset.x + this.x, offset.y + this.y);
          this.offspring--;
        }


        this.energy--;
        break;

      case "dead":
        const index = cells.indexOf(this);
        if (index > -1) {
          cells.splice(index, 1);
        }
        this.graphics.destroy();
        break;
    }
    fillTracer(this);

  }
}
export function createCell(x, y) {

  const cell = {
    ...templateCell
  };
  cell.state = "wandering";
  cell.x = x;
  cell.y = y;
  cell.energy = initialEnergy;
  cell.offspring = maxOffsping;//Math.floor(Math.random() * maxOffsping)
  cell.color = "rgb(255,0,0)";
  cell.graphics = new Graphics();
  cell.graphics.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier);
  cell.graphics.x = x * cellSize;
  cell.graphics.y = y * cellSize;
  cell.graphics.fill(cell.color);
  cellsContainer.addChild(cell.graphics);
  cells.push(cell);
}

export function fillTracer(cell) {
  let tracer;
  let isEmpty = true;
  tracersContainer.children.forEach(element => {
    if (element.x == cell.x * cellSize && element.y == cell.y * cellSize) {
      tracer = element;
      isEmpty = false;
    }
  });

  if (isEmpty) {
    tracer = new Graphics();
    tracersContainer.addChild(tracer);
    tracer.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier);
    tracer.x = cell.x * cellSize;
    tracer.y = cell.y * cellSize;
    tracer.fill(cell.color);
    tracer.alpha = tracersOpacityMultipler;
  } 
  else if (tracer.alpha+tracersOpacityMultipler <= tracersMaxOpacity)tracer.alpha += tracersOpacityMultipler;
}

export function updateTracers(){
tracersContainer.children.forEach(element => {
  element.alpha-=0.02;
  if(element.alpha <= 0){
    var index = tracersContainer.children.indexOf(element);
        if (index > -1) {
          tracersContainer.children.splice(index, 1);
        }}
});

}

