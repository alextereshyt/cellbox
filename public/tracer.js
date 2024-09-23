//tracer.js
import {
    Graphics
} from './libraries/pixi.mjs'
import {
    tracersContainer,
    cellSize,
    gridMultiplier,
    tracersOpacityMultipler,
    tracersMaxOpacity,
    tracersGrid,
    gridWidth,
    gridHeight
} from "./game.js";
import {
    isOutOfBounds
} from './cell.js';


export const templateTracer = {
    saturation: Number,
    type: String,
    owner:null,
    graphics: null,
    x: Number,
    y: Number,
};

export function leaveTracer(cell, amount = 1) {

    if (tracersGrid[cell.x][cell.y] != null) {
        let tracer = tracersGrid[cell.x][cell.y];
        tracer.saturation += amount;
        tracer.owner = cell;
        tracer.graphics.alpha = tracer.saturation/5;
    }
    else {
        let tracer = {...templateTracer}
        tracer.saturation = amount;
        tracer.owner = cell;
        tracer.x = cell.x;
        tracer.y = cell.y;
        tracer.graphics = new Graphics();
        tracersContainer.addChild(tracer.graphics);
        tracer.graphics.rect(0, 0, cellSize * gridMultiplier, cellSize * gridMultiplier);
        tracer.graphics.x = cell.x * cellSize;
        tracer.graphics.y = cell.y * cellSize;
        tracer.graphics.fill(cell.color);
        tracer.graphics.alpha   = tracer.saturation*tracersOpacityMultipler;
        

        tracersGrid[cell.x][cell.y]=tracer;
    }

}

export function evaporateTracers() {
    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            if(tracersGrid[i][j]!=null){
            tracersGrid[i][j].saturation *= 0.99;
            tracersGrid[i][j].graphics.alpha = tracersGrid[i][j].saturation*tracersOpacityMultipler;
            
           
            if(tracersGrid[i][j].graphics.alpha<0.01){

            tracersGrid[i][j].graphics.destroy();
            tracersGrid[i][j] = null;

            }
            }
        }
    }
    
}

export function generateTracersGrid() {
    for (let i = 0; i < gridWidth; i++) {
        tracersGrid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            tracersGrid[i][j] = null;
        }
    }
}


