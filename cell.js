const CELL_SIZE = 30;
const WIDTH = 600;
const HEIGHT = 600;

module.exports = class Cell {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.clicked = false;
    this.is_bomb = false;
    this.near_bombs = 0;
  }

   // Tells if x and y are inside a given cell
  contains(x, y) {
    if (this.clicked) return false;
    if (x >= this.x * CELL_SIZE &&
      x <= (this.x * CELL_SIZE) + CELL_SIZE &&
      y >= this.y * CELL_SIZE &&
      y <= (this.y * CELL_SIZE) + CELL_SIZE)
      return true;
  }

  floor_fill(current, cells) {
    current.clicked = true;
    let cols = (WIDTH / CELL_SIZE) - 2;
    let rows = (HEIGHT / CELL_SIZE) - 2;
    let x_pos = Math.floor(current.index % cols);
    let y_pos = Math.floor((current.index % cells.length) / rows);
    let bombs = 0;
    let n_cells = [];

    for (let yy = -1; yy <= 1; yy++) {
      for (let xx = -1; xx <= 1; xx++) {
        if (xx + x_pos == x_pos && yy + y_pos == y_pos) continue;
        if (xx + x_pos >= 0 && xx + x_pos < cols && yy + y_pos >= 0 && yy + y_pos < rows) {
          let n_index = Math.floor((x_pos + xx) + ((yy + y_pos) * cols));
          let cell = cells[n_index];
          if (cell.is_bomb) {
            bombs++;
          } else {
            n_cells.push(cell);
          }
        }
      }
    }

    if (bombs < 1) {
      for (let i = 0; i < n_cells.length; i++) {
        if (!n_cells[i].clicked) {
          this.floor_fill(n_cells[i], cells);
        }
      }
    }
    current.near_bombs = bombs;
  }
}