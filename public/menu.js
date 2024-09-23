//menu.js
import {
    tracersContainer,
    cellsContainer,
    initialize,
    cells,
    gridHeight,
    gridWidth,
    logicTick,
    gameLogicUpdater,
    changeLogicSpeed
} from "./game.js";

export const initButton = document.getElementById('initialize');
initButton.onclick = initialize;

export const panelDebugInfo = document.getElementById('panelDebugInfo');

export function updateDebug() {
    panelDebugInfo.textContent =
        "grid: " + Math.trunc(gridWidth).toString() + " x " + Math.trunc(gridHeight).toString() + "\n" +
        "cells: " + cellsContainer.children.length.toString() + "\n" +
        "tracers: " + tracersContainer.children.length.toString() + "\n" +
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
export const panel = document.getElementById('controlPanel');

export function panelInit() {
    if (localStorage.hasOwnProperty("panelHideStatus")) {
        panelHideStatus = JSON.parse(localStorage.getItem("panelHideStatus"));
    } else {
        localStorage.setItem("panelHideStatus", false);
        panelHideStatus = false;
    }
     
    if (panelHideStatus) {
        panelHideButton.innerHTML = "<";
        panel.style.transform = "translateX(" + panel.offsetWidth + "px)";
    } else {
        
        panelHideButton.innerHTML = ">";
        panel.style.transform = "translateX(0px)";
    }
}
export let panelHideStatus;

panelHideButton.onclick = () => {
    
    if (panelHideStatus) {
        panelHideStatus = false;
        localStorage.setItem("panelHideStatus", panelHideStatus);
        panelHideButton.innerHTML = ">";
        panel.style.transform = "translateX(0px)"
    } else {
        panelHideStatus = true;
        localStorage.setItem("panelHideStatus", panelHideStatus);
        panelHideButton.innerHTML = "<";
        panel.style.transform = "translateX(" + panel.offsetWidth + "px)"

    }
}

export const panelTickSpeed = document.getElementById('panelTickSpeed');

panelTickSpeed.onmousedown = () =>{
    changeLogicSpeed(0);
}

panelTickSpeed.onchange = () =>{
changeLogicSpeed(panelTickSpeed.value);
}


