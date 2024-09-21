//menu.js
import {
    tracersContainer,
    cellsContainer,
    initialize,
    cells,
    gridHeight,
    gridWidth
} from "./game.js";

export const initButton = document.getElementById('initialize');
initButton.onclick = initialize;

export const panelDebugInfo = document.getElementById('panelDebugInfo');

export function updateDebug(){
panelDebugInfo.textContent = 
"grid: "+gridWidth.toString() +" x "+ gridHeight.toString()+"\n" +
"cells count: "+cells.length.toString() + "\n" +
"tracers count: "+tracersContainer.children.length.toString()
;

}

export const panelTracersStatus = document.getElementById('panelTracersStatus');
panelTracersStatus.onclick = () => {
    if (panelTracersStatus.checked == true) {
        tracersContainer.visible = true;

    } else {
        tracersContainer.visible = false;
    }
}

export const panelCellsStatus = document.getElementById('panelCellsStatus');
panelCellsStatus.onclick = () => {
    if (panelCellsStatus.checked == true) {
        cellsContainer.visible = true;

    } else {
        cellsContainer.visible = false;
    }
}