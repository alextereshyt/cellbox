//menu.js
import { tracersContainer,cellsContainer } from "./game.js";

export function initialize(){

    
}


export const panelTracersStatus = document.getElementById('panelTracersStatus');
panelTracersStatus.onclick = ()=>{   
if (panelTracersStatus.checked== true){
  tracersContainer.visible = true;

}
else{
  tracersContainer.visible = false;
}
}



export const panelCellsStatus = document.getElementById('panelCellsStatus');
panelCellsStatus.onclick = ()=>{   
if (panelCellsStatus.checked== true){
  cellsContainer.visible = true;

}
else{
  cellsContainer.visible = false;
}
}


