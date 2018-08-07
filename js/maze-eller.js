<<<<<<< HEAD
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
=======
/* An implementation of Eller's algorithm for 2-d maze generation */
function generateE(width, height) {

  var biasVal = .5,  /* Maze bias value for creating an even texture */
      rowWidth = Math.ceil(width / 2),
      mazeHeight = Math.ceil(height / 2) - 1;

  function OutputPrinter() {
    this.rowNr = 0;
    this.x_coords_out = [];  /* Array used to save generated x-axis coordinates */
    this.y_coords_out = [];  /* Array used to save generated y-axis coordinates */
  }

  OutputPrinter.prototype = {
    /* Push cell to the output */
    pushCell: function(n) {
      this.x_coords_out.push(2*n - 2);
      this.y_coords_out.push(this.rowNr);
    },
    /* Remove wall between cells */
    removeWall: function(n) {
      this.x_coords_out.push(2*n - 3);
      this.y_coords_out.push(this.rowNr);
    },
    /* Push vertical cells to the output */
    pushVCell: function(n) {
      this.x_coords_out.push(2*n - 2, 2*n - 2);
      this.y_coords_out.push(this.rowNr, this.rowNr + 1);
    },
    pushNewLine: function() {
>>>>>>> Refactored code
      this.rowNr++;
    }
  }

<<<<<<< HEAD
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
=======
  /* Disjoint-set data structure */
  function Row(width) {
    this.iterator = 0;
    this.setH = {};
    this.cellH = {};
    this.width = width;
  }

  Row.prototype = {
    nextRight: function() {
      return this.cellH[++this.iterator];
    },
    nextLeft: function() {
      if (this.setH[--this.iterator] && this.setH[this.iterator].length) {
>>>>>>> Refactored code
        return this.iterator;
      }
      else if (this.iterator) {
        return this.nextLeft();
      }
<<<<<<< HEAD
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
=======
    },
    mergeSets: function (i, j) {
      for (var k = 0; k < this.setH[j].length; k++) {
        this.cellH[this.setH[j][k]] = i;
      }
      this.setH[i] = this.setH[i].concat(this.setH[j]);
      this.setH[j] = [];
    },
    /* Initialize each cell in a row. Each cell is in its own set */
    initRow: function() {
      for (var i = 1, j, lastSet = 1; i <= this.width; i++) {
        if (typeof this.cellH[i] === 'undefined') {
          for (j = lastSet; j <= this.width; j++) {
            if (typeof this.setH[j] === 'undefined') {
              lastSet = j;
              break;
            }
          }
          this.setH[lastSet] = [i];
          this.cellH[i] = lastSet;
        }
      }
    }
  };

  /* Randomly merge adjacent sets, moving from left to right */
  function joinAdjacent(row, lastRow) {
    var prev, current, cellNr = 2;
    /* Initialize each empty cell in a row */
    row.initRow();
>>>>>>> Refactored code
    /* Set prev to be the set of the first cell in a row */
    prev = row.nextRight();
    out.pushCell(1);
    while (current = row.nextRight()) {
      out.pushCell(cellNr);
<<<<<<< HEAD
      /* If this is the last row skip the bias value and merge
         different sets */
=======
      /* Merge only different sets */
>>>>>>> Refactored code
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
<<<<<<< HEAD
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
=======
    var prev, current, tmpArr, newRow = new Row(rowWidth);
    while (current = row.nextLeft()) {
      if (prev !== current) {
        if (typeof newRow.setH[current] === 'undefined') {
          newRow.setH[current] = [];
        }
        if (row.setH[current].length > 1) {
          row.setH[current].shuffle();
          tmpArr = row.setH[current].slice(Math.floor(Math.random() * row.setH[current].length));
          tmpArr.sort(function(a, b) { return a - b; });
        } else {
          tmpArr = [row.setH[current][0]];
        }
        while (tmpArr.length) {
          tmpCell = tmpArr.pop();
          newRow.setH[current].push(tmpCell);
          newRow.cellH[tmpCell] = current;
>>>>>>> Refactored code
          out.pushVCell(tmpCell);
        }
        prev = current;
      }
    }
    out.pushNewLine();
    return newRow;
  }

<<<<<<< HEAD
  const biasVal = .5;  /* Maze bias value for creating an even texture */
  const rowWidth = width;
  let mazeHeight = height - 1;

  let row = new Row(rowWidth);
  let out = new OutputConverter();

  /* Loop through all the rows except the last */
=======
  var row = new Row(rowWidth),
      out = new OutputPrinter();

>>>>>>> Refactored code
  while (mazeHeight--) {
    joinAdjacent(row, false);
    row = joinVertical(row);
  }
<<<<<<< HEAD
  /* Connect all cells in the last row */
  joinAdjacent(row, true);

  output.x = out.x_coords_out;
  output.y = out.y_coords_out;
=======
  /* Connect all adjacent (but disjoint) cells in the last row */
  joinAdjacent(row, true);

  /* Return generated solution as an object */
  return {
    x : out.x_coords_out,
    y : out.y_coords_out
  };
>>>>>>> Refactored code
};