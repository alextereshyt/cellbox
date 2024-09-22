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
"grid: "+Math.trunc(gridWidth).toString() +" x "+ Math.trunc(gridHeight).toString()+"\n" +
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

export const panelHideButton = document.getElementById('panelHideButton');
export const debugPanel = document.getElementById('debugPanel');

panelHideButton.innerHTML = ">";
export let panelHideButtonSatus = true;
panelHideButton.onclick = () => {
    if (panelHideButtonSatus == true) {
        panelHideButton.innerHTML = "<";
        debugPanel.style.transform = "translateX("+debugPanel.offsetWidth+"px)"
        panelHideButtonSatus = false

    } else {
        panelHideButtonSatus = true;
        panelHideButton.innerHTML = ">";
        debugPanel.style.transform = "translateX(0px)"
    }
}