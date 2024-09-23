//cell.js
import {
    Graphics
} from './libraries/pixi.mjs'
import {
    gridWidth,
    gridHeight,
    cellsGrid,
    cells,
    cellSize,
    gridMultiplier,
    cellsContainer,
    maxAge,
    terrainGrid,
    terrainLifeValidation,
    targetDistanceRange,
    cellsRestingTime,
    maxOffsping,
    tracersGrid,
} from "./game.js";

import {
    leaveTracer
} from './tracer.js';



export function isValidAge(age) {
    if (age > maxAge / 2 && age <= maxAge) return true;
    return false;
}

export function isTerrainValidForLife(x, y) {
    return (terrainGrid[x][y].difficulty > terrainLifeValidation)
}

export const templateCell = {
    x: Number,
    y: Number,
    direction: null,
    color: String,
    type: String,
    graphics: null,
    age: Number,
    offspring: Number,
    update: function () {
        if(this.age > maxAge){
            this.graphics.destroy();
            cells.splice(cells.indexOf(this),1);
            cellsGrid[this.x][this.y] = null;

        }
        else if (areEmptyCellsAround(this.x, this.y)) {
            let offset = getBestDirection(this);

            if (!isOutOfBounds(this.x + offset.x, this.y + offset.y) &&
                isEmptyCell(this.x + offset.x, this.y + offset.y))

                cellsGrid[this.x][this.y] = null;

            this.x += offset.x;
            this.y += offset.y;

            cellsGrid[this.x][this.y] = this;
            this.graphics.x = this.x * cellSize;
            this.graphics.y = this.y * cellSize;


        }
        leaveTracer(this);
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
    if (!isOutOfBounds(x, y - 1) && isEmptyCell(x, y - 1) && isTerrainValidForLife(x, y - 1)) return true;
    if (!isOutOfBounds(x, y + 1) && isEmptyCell(x, y + 1) && isTerrainValidForLife(x, y + 1)) return true;
    if (!isOutOfBounds(x - 1, y) && isEmptyCell(x - 1, y) && isTerrainValidForLife(x - 1, y)) return true;
    if (!isOutOfBounds(x + 1, y) && isEmptyCell(x + 1, y) && isTerrainValidForLife(x + 1, y)) return true;
    return false;
}

function getRandomTarget(x, y) {
    let target = {}
    target.x = x + (Math.random() * targetDistanceRange * 2 | 0) - targetDistanceRange;
    target.y = y + (Math.random() * targetDistanceRange * 2 | 0) - targetDistanceRange;
    return target;
}

function getBestTarget(x, y) {
    let bestTarget = getRandomTarget(x, y)
    let maxSaturation = 0;
    let targets = []

    for (let i = 0 - targetDistanceRange / 2; i < targetDistanceRange / 2; i++) {
        for (let j = 0 - targetDistanceRange / 2; j < targetDistanceRange / 2; j++) {
            if (!isOutOfBounds(x + i, y + j) &&
                i != 0 &&
                j != 0) {

                targets.push({
                    x: i,
                    y: j
                })
            }
        }
    }
    console.log(targets)
    for (let target of targets) {
        let newX = x + target.x;
        let newY = y + target.y;

        if (!isOutOfBounds(newX, newY) && isTerrainValidForLife(newX, newY)) {

            let saturationLevel = tracersGrid[newX][newY];
            if (saturationLevel > maxSaturation) {
                maxSaturation = saturationLevel;
                bestTarget = target;

            }
        }
    }
    console.log(bestTarget)
    return bestTarget;

}

function getEuclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function pathfinding(startX, startY, targetX, targetY) {
    let dx = targetX - startX;
    let dy = targetY - startY;

    let stepX = 0;
    let stepY = 0;

    let decision = Math.random() * 2 | 0;

    if (decision) stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    else stepY = dy === 0 ? 0 : dy / Math.abs(dy);

    return {
        x: stepX,
        y: stepY
    };
}


export function getRandomValidOffset(x, y) {
    let availableOffsets = [];
    if (!isOutOfBounds(x, y - 1) && isEmptyCell(x, y - 1) && isTerrainValidForLife(x, y - 1)) availableOffsets.push({
        x: 0,
        y: -1
    });
    if (!isOutOfBounds(x, y + 1) && isEmptyCell(x, y + 1) && isTerrainValidForLife(x, y + 1)) availableOffsets.push({
        x: 0,
        y: +1
    });
    if (!isOutOfBounds(x - 1, y) && isEmptyCell(x - 1, y) && isTerrainValidForLife(x - 1, y)) availableOffsets.push({
        x: -1,
        y: 0
    });
    if (!isOutOfBounds(x + 1, y) && isEmptyCell(x + 1, y) && isTerrainValidForLife(x + 1, y)) availableOffsets.push({
        x: +1,
        y: 0
    });
    const offset = availableOffsets[Math.random() * availableOffsets.length | 0];
    return offset;
}

function getBestDirection(cell) {
    let bestDirection =getRandomValidOffset(cell.x,cell.y);
    let maxSaturation = 0;

    const directions = [{
            x: 0,
            y: -1
        },
        {
            x: 0,
            y: 1
        },
        {
            x: -1,
            y: 0
        },
        {
            x: 1,
            y: 0
        }
    ];

    for (let direction of directions) {

        if (!isOutOfBounds(cell.x + direction.x, cell.y + direction.y) &&
            isTerrainValidForLife(cell.x + direction.x,  cell.y + direction.y)&&
            isEmptyCell(cell.x+direction.x,cell.y+direction.y)&&
            tracersGrid[cell.x + direction.x][cell.y + direction.y]!=null &&
            tracersGrid[cell.x+  direction.x][cell.y+ direction.y].owner != cell
        ) {
          
            let saturationLevel = tracersGrid[cell.x + direction.x][cell.y + direction.y].saturation;
            if (saturationLevel > maxSaturation) {
                maxSaturation = saturationLevel;
                bestDirection = direction;

            }
        }
        
    }

    return bestDirection;
}

export function degreesToDirection(degrees) {
    degrees = degrees % 360;


    if (degrees >= 315 || degrees < 45) {
        return {
            x: 1,
            y: 0
        };
    } else if (degrees >= 45 && degrees < 135) {
        return {
            x: 0,
            y: -1
        };
    } else if (degrees >= 135 && degrees < 225) {
        return {
            x: -1,
            y: 0
        };
    } else {
        return {
            x: 0,
            y: 1
        };
    }
}

export function createCell(x, y,color) {
    const cell = {
        ...templateCell
    };

    cell.type = "settlement";
    cell.x = x;
    cell.y = y;
    cell.age = 0;
    cell.offspring = 0;
    cell.color = color;
    cell.graphics = new Graphics();
    cell.graphics.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier);
    cell.graphics.x = x * cellSize;
    cell.graphics.y = y * cellSize;
    cell.graphics.fill(cell.color);
    cellsContainer.addChild(cell.graphics);
    cellsGrid[x][y] = cell;
    cells.push(cell);
    leaveTracer(cell);
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