/*
  Printer object used to convert different maze representation formats
  to a unified coordinate format which would be used for printing/drawing
*/
class Printer {

  constructor(width) {
    this.width = width;
    this.left = [];
    this.right = [];
    this.walls = [];
    this.x = [];
    this.y = [];
    this.d = []; // direction
  }

  addAdjecentWalls(left, right) {
    this.left.push(left);
    this.right.push(right);
  }

  addHorizontalWall(start, end, splitX, splitY) {
    this.walls.push([start, end, splitX, splitY, Printer.HORIZONTAL_WALL]);
  }

  addVerticalWall(start, end, splitX, splitY) {
    this.walls.push([start, end, splitX, splitY, Printer.VERTICAL_WALL]);
  }

  addCell(x, y, d) {
    this.x.push(x);
    this.y.push(y);
    this.d.push(d);
  }

  addCellWithDirection(x, y, d) {
    this.x.push(x);
    this.y.push(y);
    this.d.push(d);
  }

  removeCell() {
    this.x.pop();
    this.y.pop();
    this.d.pop();
  }

  /**
   * Convert list of vertical/horizontal walls to an array of coordinates
   * Horizontal walls will have an odd Y and even X and
   * Vertical walls will have an even Y and an odd X
   */
  wallsToCoords() {
    const x_coords_out = [];
    const y_coords_out = [];

    const walls = this.walls;

    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      const start = w[0] * 2;
      const end = w[1] * 2 + 1;
      const angle = w[4];

      if (angle === Printer.HORIZONTAL_WALL) {
        // X has to be even and Y odd
        const x = w[2] * 2;
        const y = w[3] * 2 + 1;

        for (let i = start; i < x; i++) {
          x_coords_out.push(i);
          y_coords_out.push(y);
        }
        // Skip wall split point
        for (let i = x + 1; i < end; i++) {
          x_coords_out.push(i);
          y_coords_out.push(y);
        }
      } else {
        // X has to be odd and Y even
        const x = w[2] * 2 + 1;
        const y = w[3] * 2;

        for (let i = start; i < y; i++) {
          x_coords_out.push(x);
          y_coords_out.push(i);
        }
        for (let i = y + 1; i < end; i++) {
          x_coords_out.push(x);
          y_coords_out.push(i);
        }
      }
    }

    return {
      x : x_coords_out,
      y : y_coords_out
    };
  }

  /* Convert adjecent wall list to coordinates array */
  adjecentWallsToCoords() {
    const x_coords_out = [];
    const y_coords_out = [];

    const left = this.left;
    const right = this.right;
    const w = this.width;

    for (let i = 0; i < left.length; i++) {
      const x = left[i] % w * 2;
      const y = ~~(left[i]/w) * 2; // left[i]/w<<1

      if (left[i] === right[i] - 1) {
        x_coords_out.push(x, x + 1, x + 2);
        y_coords_out.push(y, y, y);
      } else {
        x_coords_out.push(x, x, x);
        y_coords_out.push(y, y + 1, y + 2);
      }
    }

    return {
      x : x_coords_out,
      y : y_coords_out
    };
  }

  /* Convert cell with directions to coordinates ready for drawing */
  cellsWithDirectionsToCoords() {
    const xArray = this.x;
    const yArray = this.y;
    const dArray = this.d;

    const x_coords_out = [xArray[0] * 2];
    const y_coords_out = [yArray[0] * 2];

    // First cell doesn't have a direction, so we skip it
    for (let i = 1; i < xArray.length; i++) {
      const x = xArray[i] * 2;
      const y = yArray[i] * 2;
      const dir = dArray[i];

      // Use direction to connect with a previous cell
      if (dir === Maze2D.NORTH) {
        x_coords_out.push(x);
        y_coords_out.push(y + 1);
      }
      else if (dir === Maze2D.EAST) {
        x_coords_out.push(x - 1);
        y_coords_out.push(y);
      }
      else if (dir === Maze2D.SOUTH) {
        x_coords_out.push(x);
        y_coords_out.push(y - 1);
      }
      else {
        x_coords_out.push(x + 1);
        y_coords_out.push(y);
      }

      x_coords_out.push(x);
      y_coords_out.push(y);
    }

    return {
      x : x_coords_out,
      y : y_coords_out
    };
  }

  /* Debug */
  printCoords() {
    if (this.left) {
      console.log(this.left, this.right);
    } else {
      console.log(this.x, this.y, this.d);
    }
  }
}

// Static properties
Printer.HORIZONTAL_WALL = 0;
Printer.VERTICAL_WALL  = 1;