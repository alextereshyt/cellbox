//objects.js
import {
  cellSize,
  terrainGrid,
  gridWidth,
  gridHeight,
  cells,
  terrainContainer,
  cellsContainer,
  tracersContainer,
  gridMultiplier,
  tracersOpacityMultipler,
  tracersMaxOpacity,
  maxAge,
  maxOffsping,
  cellsGrid,
  terrainTypeWaterValueRange,
  terrainTypeSandValueRange,
  terrainTypePlainValueRange,
  terrainTypeRockValueRange,
  terrainTypeWaterColorRange,
  terrainTypeSandColorRange,
  terrainTypePlainColorRange,
  terrainTypeRockColorRange
} from './game.js';
import {
  Graphics
} from './libraries/pixi.mjs'

// Terrain 
export const templateTerrain = {
  type: String,
  difficulty: Number,
  color: String,
  pixel: null,
};

function determineTerrainType(normalizedNoise) {
  if (normalizedNoise > terrainTypeWaterValueRange.start &&
    normalizedNoise < terrainTypeWaterValueRange.end) {
    return 'water';
  } else if (normalizedNoise >= terrainTypeSandValueRange.start &&
    normalizedNoise < terrainTypeSandValueRange.end) {
    return 'sand';
  } else if (normalizedNoise >= terrainTypePlainValueRange.start &&
    normalizedNoise < terrainTypePlainValueRange.end) {
    return 'plain';
  } else if (normalizedNoise > terrainTypeRockValueRange.start &&
    normalizedNoise <= terrainTypeRockValueRange.end) {
    return 'rock';
  }
}

export function mapGradient(value, rangeStart, rangeEnd, colorA, colorB) {
  let colorC = {
    r: Math.floor(map(value, rangeStart, rangeEnd, colorA.r, colorB.r)),
    g: Math.floor(map(value, rangeStart, rangeEnd, colorA.g, colorB.g)),
    b: Math.floor(map(value, rangeStart, rangeEnd, colorA.b, colorB.b)),
  }
  return colorC;
}

function generateTerrainColor(terrainType, normalizedNoise) {
  let color;
  switch (terrainType) {
    case 'water':
      color = mapGradient(normalizedNoise, terrainTypeWaterValueRange.start, terrainTypeWaterValueRange.end,
        terrainTypeWaterColorRange.start, terrainTypeWaterColorRange.end);
      return `rgb(${color.r},${color.g},${color.b})`;
    case 'sand':
      color = mapGradient(normalizedNoise, terrainTypeSandValueRange.start, terrainTypeSandValueRange.end,
        terrainTypeSandColorRange.start, terrainTypeSandColorRange.end);
      return `rgb(${color.r},${color.g},${color.b})`;
    case 'plain':
      color = mapGradient(normalizedNoise, terrainTypePlainValueRange.start, terrainTypePlainValueRange.end,
        terrainTypePlainColorRange.start, terrainTypePlainColorRange.end);
      return `rgb(${color.r},${color.g},${color.b})`;
    case 'rock':
      color = mapGradient(normalizedNoise, terrainTypeRockValueRange.start, terrainTypeRockValueRange.end,
        terrainTypeRockColorRange.start, terrainTypeRockColorRange.end);
      return `rgb(${color.r},${color.g},${color.b})`;

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
  terrain.difficulty = normalizedNoise;
  terrain.type = determineTerrainType(normalizedNoise);
  terrain.color = generateTerrainColor(terrain.type, normalizedNoise);
  return terrain;
}

export function generateTerrainGrid() {
  noise.seed(Math.random());
  for (let i = 0; i < gridWidth; i++) {
    terrainGrid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      const terrain = generateTerrain(i, j); // Create copy using object spread
      terrain.pixel = new Graphics(); // Create the graphics object
      terrain.pixel.rect(i * cellSize, j * cellSize, cellSize * gridMultiplier, cellSize * gridMultiplier);
      terrain.pixel.fill(terrain.color);
      terrainContainer.addChild(terrain.pixel);
      terrainGrid[i][j] = terrain;
    }
  }
}

function map(value, start1, end1, start2, end2) {
  const range1 = end1 - start1;
  const range2 = end2 - start2;
  const ratio = (value - start1) / range1;
  return start2 + (ratio * range2);
}

// Cells

export function isValidAge(age) {
  if (age > maxAge / 2 && age <= maxAge) return true;
  return false;
}

export function isTerrainValidForLife(x,y){
return (terrainGrid[x][y].difficulty > terrainTypeWaterValueRange.end)
}

export const templateCell = {
  x: Number,
  y: Number,
  state: String,
  color: String,
  graphics: null,
  age: Number,
  offspring: Number,
  update: function () {

    if (this.age > maxAge) {
      this.state = "dead"
    } else if ( 
      isTerrainValidForLife(this.x,this.y)
      && hasNeighborCells(this.x, this.y) 
      && isValidAge(this.age) 
      && this.offspring 
      //&& Math.random() * 10 | 0 == 9
    ) {
      this.state = "reproduction";
    } else this.state = "wandering";

    switch (this.state) {
      case "wandering":

        if (areEmptyCellsAround(this.x, this.y)) {
          let offset = groundOffset(this.x, this.y);
          if (!isOutOfBounds(offset.x + this.x, offset.y + this.y) &&
            isEmptyCell(offset.x + this.x, offset.y + this.y)
          ) {

            cellsGrid[this.x][this.y] = null;
            this.x = offset.x + this.x;
            this.y = offset.y + this.y;
            this.graphics.x = this.x * cellSize;
            this.graphics.y = this.y * cellSize;
            cellsGrid[this.x][this.y] = this;

          }
        }
        break;
      case "reproduction":
        if (areEmptyCellsAround(this.x, this.y)) {
          let offset = groundOffset(this.x, this.y)
          if (
            !isOutOfBounds(offset.x + this.x, offset.y + this.y) &&
            isEmptyCell(offset.x + this.x, offset.y + this.y)
          ) {
            createCell(offset.x + this.x, offset.y + this.y);
            this.offspring--;
          }
        }
        break;

      case "dead":
        cellsGrid[this.x][this.y] = null;
        cells.splice(cells.indexOf(this), 1);
        this.graphics.destroy();
        break;
    }
    fillTracer(this);
    this.age++;

  }
}

export function isEmptyCell(x, y) {
  if (cellsGrid[x][y] == null) return true;
  return false;
}

export function isOutOfBounds(x, y) {
  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) return false;
  return true;
}

export function hasNeighborCells(x, y) {
  if (!isOutOfBounds(x, y - 1) && !isEmptyCell(x, y - 1)) return true;
  if (!isOutOfBounds(x, y + 1) && !isEmptyCell(x, y + 1)) return true;
  if (!isOutOfBounds(x - 1, y) && !isEmptyCell(x - 1, y)) return true;
  if (!isOutOfBounds(x + 1, y) && !isEmptyCell(x + 1, y)) return true;
  return false;
}


export function areEmptyCellsAround(x, y) {
  if (!isOutOfBounds(x, y - 1) && isEmptyCell(x, y - 1) && isTerrainValidForLife(x,y-1)) return true;
  if (!isOutOfBounds(x, y + 1) && isEmptyCell(x, y + 1) && isTerrainValidForLife(x,y+1)) return true;
  if (!isOutOfBounds(x - 1, y) && isEmptyCell(x - 1, y) && isTerrainValidForLife(x-1,y)) return true;
  if (!isOutOfBounds(x + 1, y) && isEmptyCell(x + 1, y) && isTerrainValidForLife(x+1,y)) return true;
  return false;
}

export function groundOffset(x, y) {
  let availableOffsets = [];
  if (!isOutOfBounds(x, y - 1) && isEmptyCell(x, y - 1) && isTerrainValidForLife(x,y-1)) availableOffsets.push({
    x: 0,
    y: -1
  });
  if (!isOutOfBounds(x, y + 1) && isEmptyCell(x, y + 1) &&isTerrainValidForLife(x,y+1)) availableOffsets.push({
    x: 0,
    y: +1
  });
  if (!isOutOfBounds(x - 1, y) && isEmptyCell(x - 1, y) && isTerrainValidForLife(x-1,y)) availableOffsets.push({
    x: -1,
    y: 0
  });
  if (!isOutOfBounds(x + 1, y) && isEmptyCell(x + 1, y) && isTerrainValidForLife(x+1,y)) availableOffsets.push({
    x: +1,
    y: 0
  });
  const offset = availableOffsets[Math.random() * availableOffsets.length | 0];
  return offset;
}

export function createCell(x, y) {
  const cell = {
    ...templateCell
  };
  cell.state = "wandering";
  cell.x = x;
  cell.y = y;
  cell.age = 0;
  cell.offspring = maxOffsping;
  cell.color = "rgb(255,0,0)";
  cell.graphics = new Graphics();
  cell.graphics.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier);
  cell.graphics.x = x * cellSize;
  cell.graphics.y = y * cellSize;
  cell.graphics.fill(cell.color);
  cellsContainer.addChild(cell.graphics);
  cellsGrid[x][y] = cell;
  cells.push(cell);
}
export function updateCells() {
  for (let cell of cells) {
    cell.update();

  }
  // for (let i of cellsGrid) {
  //   for (let j of i) {
  //     if (j != null)j.update();
  //   }
  // }
}

export function generateCellsGrid() {
  for (let i = 0; i < gridWidth; i++) {
    cellsGrid[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      cellsGrid[i][j] = null;
    }
  }
}

// Tracers

export function fillTracer(cell) {
  let tracer;
  let isEmpty = true;
  for (let element of tracersContainer.children) {
    if (element.x == cell.x * cellSize && element.y == cell.y * cellSize) {
      tracer = element;
      isEmpty = false;
    }
  }

  if (isEmpty) {
    tracer = new Graphics();
    tracersContainer.addChild(tracer);
    tracer.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier);
    tracer.x = cell.x * cellSize;
    tracer.y = cell.y * cellSize;
    tracer.fill(cell.color);
    tracer.alpha = tracersOpacityMultipler;
  } else if (tracer.alpha + tracersOpacityMultipler <= tracersMaxOpacity) tracer.alpha += tracersOpacityMultipler;
}

export function updateTracers() {
  for (let element of tracersContainer.children) {
    element.alpha -= 0.02;
    if (element.alpha <= 0) {
      let index = tracersContainer.children.indexOf(element);
      if (index > -1) {
        tracersContainer.children.splice(index, 1);
      }
    }
  }

}