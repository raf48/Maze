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
      this.rowNr++;
    }
  }

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
        return this.iterator;
      }
      else if (this.iterator) {
        return this.nextLeft();
      }
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
    /* Set prev to be the set of the first cell in a row */
    prev = row.nextRight();
    out.pushCell(1);
    while (current = row.nextRight()) {
      out.pushCell(cellNr);
      /* Merge only different sets */
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
          out.pushVCell(tmpCell);
        }
        prev = current;
      }
    }
    out.pushNewLine();
    return newRow;
  }

  var row = new Row(rowWidth),
      out = new OutputPrinter();

  while (mazeHeight--) {
    joinAdjacent(row, false);
    row = joinVertical(row);
  }
  /* Connect all adjacent (but disjoint) cells in the last row */
  joinAdjacent(row, true);

  /* Return generated solution as an object */
  return {
    x : out.x_coords_out,
    y : out.y_coords_out
  };
};