var socket;

var cells = [];
const CELL_SIZE = 30;
const WIDTH = 600;
const HEIGHT = 600;
const MINES = 30;

function setup() {
  createCanvas(600, 600);

  socket = io.connect('http://localhost:3000');

  socket.on('messages', (response) => {
    let op = response.type;
    switch(op) {
      case "connect":
        cells = [];
        let tmp = response.payload.cells;
        tmp.forEach(cell => {
          cells.push(new Cell(cell.x, cell.y, cell.clicked, cell.is_bomb, cell.near_bombs));
        });
        break;
    }
  });
}

function mouseClicked() {
  let clickX = mouseX;
  let clickY = mouseY;

  socket.emit('click', {x: clickX, y: clickY});
}

function draw() {
  background(111);

  cells.forEach(cell => {
    cell.draw();
  });
}

class Cell {
  constructor(x, y, clicked, is_bomb, near_bombs) {
    this.x = x;
    this.y = y;
    this.clicked = clicked;
    this.is_bomb = is_bomb;
    this.near_bombs = near_bombs;
  }

  draw() {
    if (this.clicked) {
      fill(255, 0, 204);
    } else {
      fill(255, 204, 0);
    }

    rect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    if (this.near_bombs > 0) {
      textSize(18);
      fill(0, 0, 0);
      text("" + this.near_bombs, this.x * CELL_SIZE + CELL_SIZE / 2 - 5, this.y * CELL_SIZE + CELL_SIZE / 2 + 5);
    }
    if (this.is_bomb && this.clicked){
      textSize(18);
      fill(255, 255, 255);
      text("B", this.x * CELL_SIZE + CELL_SIZE / 2 - 5, this.y * CELL_SIZE + CELL_SIZE / 2 + 5);
    }
  }
}