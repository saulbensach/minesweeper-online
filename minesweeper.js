const Cell = require('./cell.js');
console.log("Minesweeper started!");

var cells = [];
const CELL_SIZE = 30;
const WIDTH = 600;
const HEIGHT = 600;
const MINES = 30;

// setup
let index = 0;
for(let y = 0; y < WIDTH / CELL_SIZE; y++) {
  for(let x = 0; x < HEIGHT / CELL_SIZE; x++){
    if (y == 0) continue;
    if (x == 0) continue;
    if (x == WIDTH / CELL_SIZE - 1) continue;
    if (y == HEIGHT / CELL_SIZE - 1) continue;

    cells.push(new Cell(x, y, index++));
  }
}

let left = MINES;
while (left != 0) {
  let index = Math.floor(Math.random() * (cells.length - 1));
  let cell = cells[index];
  if (!cell.is_bomb) {
    cell.is_bomb = true;
    left--;
  }
}

function send_state(){
  let state = {
    cell_size: CELL_SIZE,
    width: WIDTH,
    height: HEIGHT,
    cells: cells,
    mines: MINES
  }

  return state;
}

function perform_click(x, y) {
  for(let i = 0; i < cells.length; i++){
    if(cells[i].contains(x, y)){
      cells[i].clicked = true;
      cells[i].floor_fill(cells[i], cells);
      break;
    }
  }
}

process.on('message', (payload) => {
  let op = payload.type;

  switch(op) {
    case "connect":
      process.send({type: "connect", payload: send_state()});
      break;
    case "click":
      perform_click(payload.payload.x, payload.payload.y);
      process.send({type: "connect", payload: send_state()});
      break;
  }
});