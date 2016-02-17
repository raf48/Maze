/* An implementation of Prim's algorithm for 2-d maze generation */
function generateP(width, height, startX, startY) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [],  /* Array used to save generated y-axis coordinates */
      matrix = Array.matrix(width, height, 0), /* 2-dimentional array */
      heap,
      w,
      tmpCell;

  /* Min-heap binary tree */
  function MinHeap() {
    /* Root element is null */
    this.data = [null];
  }

  MinHeap.prototype = {
    insert: function(el) {
      this.bubble(this.data.push(el) - 1);
    },
    remove: function() {
      var r = this.data[1];
      this.data[1] = this.data.pop();
      this.sink(1);
      return r;
    },
    bubble: function(i) {
      var parentIndex = Math.floor(i/2);
      if (this.data[parentIndex] && this.data[parentIndex].weight > this.data[i].weight) {
        this.swap(i, parentIndex);
        this.bubble(parentIndex);
      }
    },
    swap: function(i, j) {
      var tmp = this.data[i];
      this.data[i] = this.data[j];
      this.data[j] = tmp;
    },
    sink: function(i) {
      if (!this.data[i*2] || !this.data[i*2 + 1]) return;
      var leftSmaller = this.data[i*2].weight < this.data[i*2 + 1].weight,
          childIndex = leftSmaller ? i*2 : i*2 + 1;
      if (this.data[i].weight > this.data[childIndex].weight) {
        this.swap(i, childIndex);
        if (childIndex*2 + 1 < this.data.length) {
          this.sink(childIndex);
        }
      }
    },
    childExists: function() {
      return !!this.data[2];
    }
  };

  function Cell(x, y) {
    this.x = x;
    this.y = y;
  }

  function Wall(x, y, left, right, weight) {
    this.x = x;
    this.y = y;
    this.left = left;
    this.right = right;
    this.weight = weight;
  }

  function createCells(m) {
    var i, j;
    for (i = 0; i < m.length; i+=2) {
      for (j = 0; j < m[i].length; j+=2) {
        m[i][j] = new Cell(i, j);
      }
    }
  }

  function createWalls(m) {
    var i, j;

    /* Create horizontal walls */
    for (i = 1; i < m.length - 1; i+=2) {
      for (j = 0; j < m[i].length; j+=2) {
        m[i][j] = new Wall(i, j, m[i - 1][j], m[i + 1][j], Math.random());
      }
    }

    /* Create vertical walls */
    for (i = 0; i < m.length; i+=2) {
      for (j = 1; j < m[i].length - 1; j+=2) {
        m[i][j] = new Wall(i, j, m[i][j - 1], m[i][j + 1], Math.random());
      }
    }
  }

  /* Add walls of a given cell to the wall list */
  function addWalls(i, j) {
    if (typeof matrix[i + 1] !== 'undefined' && typeof matrix[i + 1][j] !== 'undefined') {
      heap.insert(matrix[i + 1][j]);
    }
    if (typeof matrix[i - 1] !== 'undefined' && typeof matrix[i - 1][j] !== 'undefined') {
      heap.insert(matrix[i - 1][j]);
    }
    if (typeof matrix[i] !== 'undefined' && typeof matrix[i][j + 1] !== 'undefined') {
      heap.insert(matrix[i][j + 1]);
    }
    if (typeof matrix[i] !== 'undefined' && typeof matrix[i][j - 1] !== 'undefined') {
      heap.insert(matrix[i][j - 1]);
    }
  }

  heap = new MinHeap();

  createCells(matrix);
  createWalls(matrix);

  /* Mark first cell as part of the maze, push its coordinates to the output stack
   * and add it's walls to the wall list */
  matrix[startX][startY].visited = true;
  x_coords_out.push(startX);
  y_coords_out.push(startY);
  addWalls(startX, startY);

  /* While there are walls in the list */
  while (heap.childExists()) {
    /* Pick a random wall from the list */
    w = heap.remove();
    /* Find if the opposite cell has not yet been visited,
     * add it's coordinates to the output stack,
     * add neighboring walls of the cell to the wall list. */
    if (w && (!w.left.visited || !w.right.visited)) {
      tmpCell = (!w.left.visited) ? w.left : w.right;
      tmpCell.visited = true;
      x_coords_out.push(w.x, tmpCell.x);
      y_coords_out.push(w.y, tmpCell.y);
      addWalls(tmpCell.x, tmpCell.y);
    }
  }

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
};