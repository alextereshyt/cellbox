//terrai.js
import {
    Graphics
} from './libraries/pixi.mjs'

import {
    gridWidth,
    gridHeight,
    terrainGrid,
    terrainTypeWaterColorRange,
    terrainTypeSandColorRange,
    terrainTypePlainColorRange,
    terrainTypeRockColorRange,
    terrainTypeWaterValueRange,
    terrainTypeSandValueRange,
    terrainTypePlainValueRange,
    terrainTypeRockValueRange,
    terrainNoiseMaskRange,
    cellSize,
    gridMultiplier,
    terrainContainer
} from './game.js';

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

export function noiseMask(amaount) {
    return Math.random() * amaount | 0 - (amaount / 2) + 1;
}

function map(value, start1, end1, start2, end2) {
    const range1 = end1 - start1;
    const range2 = end2 - start2;
    const ratio = (value - start1) / range1;
    return start2 + (ratio * range2);
}

function generateTerrainColor(terrainType, normalizedNoise) {
    let color;
    let rMask,gMask,bMask;
    rMask = noiseMask(terrainNoiseMaskRange);
    gMask = noiseMask(terrainNoiseMaskRange);
    bMask = noiseMask(terrainNoiseMaskRange);

    switch (terrainType) {
        case 'water':
            color = mapGradient(normalizedNoise, terrainTypeWaterValueRange.start, terrainTypeWaterValueRange.end,
                terrainTypeWaterColorRange.start, terrainTypeWaterColorRange.end);
                return `rgb(${color.r+rMask},${color.g+gMask},${color.b+bMask})`;
        case 'sand':
            color = mapGradient(normalizedNoise, terrainTypeSandValueRange.start, terrainTypeSandValueRange.end,
                terrainTypeSandColorRange.start, terrainTypeSandColorRange.end);
            return `rgb(${color.r+rMask},${color.g+gMask},${color.b+bMask})`;
        case 'plain':
            color = mapGradient(normalizedNoise, terrainTypePlainValueRange.start, terrainTypePlainValueRange.end,
                terrainTypePlainColorRange.start, terrainTypePlainColorRange.end);
            return `rgb(${color.r+rMask},${color.g+gMask},${color.b+bMask})`;
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