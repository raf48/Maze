/*
  An implementation of Eller's algorithm for 2-d maze generation
*/
function genEller(width, height, output) {

  class OutputConverter {
    constructor() {
      this.rowNr = 0;
      this.x_coords_out = [];  /* x-axis coordinates */
      this.y_coords_out = [];  /* y-axis coordinates */
    }

    /* Push cell to the output */
    pushCell(n) {
      this.x_coords_out.push(2*n - 2);
      this.y_coords_out.push(this.rowNr);
    }

    /* Remove wall between cells */
    removeWall(n) {
      this.x_coords_out.push(2*n - 3);
      this.y_coords_out.push(this.rowNr);
    }

    /* Push vertical cells to the output */
    pushVCell(n) {
      this.x_coords_out.push(2*n - 2, 2*n - 2);
      this.y_coords_out.push(this.rowNr, this.rowNr + 1);
    }

    pushNewLine() {
      this.rowNr++;
    }
  }

  /* Row class used for iteration */
  class Row {
    constructor(width) {
      this.iterator = 0;
      this.set = {};
      this.cell = {};
      this.width = width;
    }

    nextRight() {
      return this.cell[++this.iterator];
    }

    nextLeft() {
      if (this.set[--this.iterator] && this.set[this.iterator].length) {
        return this.iterator;
      }
      else if (this.iterator) {
        return this.nextLeft();
      }
    }

    mergeSets(i, j) {
      for (let k = 0; k < this.set[j].length; k++) {
        this.cell[this.set[j][k]] = i;
      }
      this.set[i] = this.set[i].concat(this.set[j]);
      this.set[j] = [];
    }

    /* Initialize each cell in a row. Each cell belongs to it's own set */
    initRow() {
      let prevSetNr = 1; // previous set number holder
      for (let i = 1; i <= this.width; i++) {
        // Initialize cells that are not yet initialized by previous row
        if (!this.cell[i]) {
          for (let j = prevSetNr; j <= this.width; j++) {
            if (!this.set[j]) {
              prevSetNr = j;
              break;
            }
          }
          this.set[prevSetNr] = [i];
          this.cell[i] = prevSetNr;
        }
      }
    }
  }

  /* Randomly merge adjacent sets, moving from left to right */
  function joinAdjacent(row, lastRow) {
    let prev, current, cellNr = 2;
    /* Initialize every empty cell in a row */
    row.initRow();
    // console.log('row', row);
    /* Set prev to be the set of the first cell in a row */
    prev = row.nextRight();
    out.pushCell(1);
    while (current = row.nextRight()) {
      out.pushCell(cellNr);
      /* If this is the last row skip the bias value and merge
         different sets */
      if (prev !== current && (Math.random() < biasVal || lastRow)) {
        row.mergeSets(prev, current);
        out.removeWall(cellNr);
      } else {
        prev = current;
      }
      cellNr++;
    }
    out.pushNewLine();
  }

  /* Randomly determine the vertical connections, at least one per set */
  function joinVertical(row) {
    let prev, current, tmpArr, newRow = new Row(rowWidth);
    while (current = row.nextLeft()) {
      if (prev !== current) {
        if (!newRow.set[current]) {
          newRow.set[current] = [];
        }
        if (row.set[current].length > 1) {
          row.set[current].shuffle();
          tmpArr = row.set[current]
            .slice(Math.floor(Math.random() * row.set[current].length))
            .sort((a, b) => a - b);
        } else {
          tmpArr = [row.set[current][0]];
        }
        while (tmpArr.length) {
          tmpCell = tmpArr.pop();
          newRow.set[current].push(tmpCell);
          newRow.cell[tmpCell] = current;
          out.pushVCell(tmpCell);
        }
        prev = current;
      }
    }
    out.pushNewLine();
    return newRow;
  }

  const biasVal = .5;  /* Maze bias value for creating an even texture */
  const rowWidth = width;
  let mazeHeight = height - 1;

  let row = new Row(rowWidth);
  let out = new OutputConverter();

  /* Loop through all the rows except the last */
  while (mazeHeight--) {
    joinAdjacent(row, false);
    row = joinVertical(row);
  }
  /* Connect all cells in the last row */
  joinAdjacent(row, true);

  output.x = out.x_coords_out;
  output.y = out.y_coords_out;
};