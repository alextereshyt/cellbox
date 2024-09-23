import {
    Graphics
} from './libraries/pixi.mjs'
import {
    cellSize,
    gridHeight,
    gridMultiplier,
    gridWidth,
    resourceNoiseMaskRange,
    resourcesContainer,
    resourcesGrid,
    resourceTypeGoldChance,
    resourceTypeGoldColor,
    resourceTypeCrystalChance,
    resourceTypeCrystalColor,
    resourceTypeTreeChance,
    resourceTypeTreeColor,
    terrainGrid
} from "./game.js";
import {
    noiseMask
} from './terrain.js';


export const templeteResource = {
    type: String,
    color: String,
    graphics: null,
}

function generateResource(x, y) {
    let resource = {
        ...templeteResource
    }

    switch (terrainGrid[x][y].type) {

        case "plain":
            if ((Math.random() * resourceTypeTreeChance | 0) == 0) {
                resource.color = resourceTypeTreeColor;
                resource.type = "tree";
            } else resource = null;
            break;

        case "rock":
            if ((Math.random() * resourceTypeGoldChance | 0) == 0) {
                resource.color = resourceTypeGoldColor;
                resource.type = "gold";
            } else resource = null;
            break;
            break;

        case "sand":
            if ((Math.random() * resourceTypeCrystalChance | 0) == 0) {
                resource.color = resourceTypeCrystalColor;
                resource.type = "nautilusShell";
            } else resource = null;
            break;
            break;

    }
    return resource;

}

export function isValidForResourceSpawn(x, y) {
    if (terrainGrid[x][y] != null &&
        (terrainGrid[x][y].type == "plain" ||
            terrainGrid[x][y].type == "rock" ||
            terrainGrid[x][y].type == "sand"
        )
    ) return true;
    else return false;
}

export function generateResourcesGrid() {
    for (let i = 0; i < gridWidth; i++) {
        resourcesGrid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            if (isValidForResourceSpawn(i, j)) {
                const resource = generateResource(i, j);
                if (resource != null) {
                    resource.graphics = new Graphics();
                    resource.graphics.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier)
                    resource.graphics.x = i * cellSize;
                    resource.graphics.y = j * cellSize;
                    resource.graphics.fill(`rgb(${resource.color.r+noiseMask(resourceNoiseMaskRange)}
                    ,${resource.color.g+noiseMask(resourceNoiseMaskRange)}
                    ,${resource.color.b+noiseMask(resourceNoiseMaskRange)})`)
                    resourcesContainer.addChild(resource.graphics);
                    resourcesGrid[i][j] = resource;
                } else
                    resourcesGrid[i][j] = null;

            } else
                resourcesGrid[i][j] = null;
        }
    }
}