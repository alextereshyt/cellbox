//menu.js
import {
    tracersContainer,
    cellsContainer,
    initialize,
    cells,
    gridHeight,
    gridWidth,
    logicTick
} from "./game.js";

export const initButton = document.getElementById('initialize');
initButton.onclick = initialize;

export const panelDebugInfo = document.getElementById('panelDebugInfo');

export function updateDebug() {
    panelDebugInfo.textContent =
        "grid: " + Math.trunc(gridWidth).toString() + " x " + Math.trunc(gridHeight).toString() + "\n" +
        "cells count: " + cellsContainer.children.length.toString() + "\n" +
        "tracers count: " + tracersContainer.children.length.toString() + "\n" +
        "tick: " + logicTick.toString();;

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

export function panelInit() {
    if (localStorage.hasOwnProperty("panelHideStatus")) {
        panelHideStatus = JSON.parse(localStorage.getItem("panelHideStatus"));
    } else {
        localStorage.setItem("panelHideStatus", false);
        panelHideStatus = false;
    }
     
    if (panelHideStatus) {
        panelHideButton.innerHTML = "<";
        debugPanel.style.transform = "translateX(" + debugPanel.offsetWidth + "px)";
    } else {
        
        panelHideButton.innerHTML = ">";
        debugPanel.style.transform = "translateX(0px)";
    }
}
export let panelHideStatus;

panelHideButton.onclick = () => {
    
    if (panelHideStatus) {
        panelHideStatus = false;
        localStorage.setItem("panelHideStatus", panelHideStatus);
        panelHideButton.innerHTML = ">";
        debugPanel.style.transform = "translateX(0px)"
    } else {
        panelHideStatus = true;
        localStorage.setItem("panelHideStatus", panelHideStatus);
        panelHideButton.innerHTML = "<";
        debugPanel.style.transform = "translateX(" + debugPanel.offsetWidth + "px)"

    }
}