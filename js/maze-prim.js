<<<<<<< HEAD
/*
  An implementation of Prim's algorithm for 2-d maze generation
*/
function genPrim(width, height, out, startX, startY, dataStructure) {

  /* Initialize 2-D maze with empty cells */
  const maze = new Maze2D(width, height);
  /* Init wall storage based on data structure */
  maze.initWalls(dataStructure);

  /* Mark first cell as visited */
  maze.visit(startX, startY);
  /* Push adjacent walls to storage */   
  maze.addWalls(startX, startY);
  /* Push cell coordinates to the output stack */
  out.addCell(startX, startY);

  const walls = maze.walls;

  /* While walls exist in storage */
  while (walls.notEmpty()) {
    /* Pick a random wall by removing it from storage */
    const w = walls.remove();
    /* Check if the opposite cell is not visited */
    if (!maze.isVisited(w.x, w.y)) {
      maze.visit(w.x, w.y);
      maze.addWalls(w.x, w.y);
      out.addCell(w.x, w.y, w.direction);
    }
  }
=======
/* An implementation of randomized Prim's algorithm for 2-d maze generation */
function generateP(width, height, matrix, startX, startY) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [];  /* Array used to save generated y-axis coordinates */

  function Cell(x, y) {
    this.x = x;
    this.y = y;
  }

  function Wall(x, y, left, right) {
    this.x = x;
    this.y = y;
    this.left = left;
    this.right = right;
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
        m[i][j] = new Wall(i, j, m[i - 1][j], m[i + 1][j]);
      }
    }

    /* Create vertical walls */
    for (i = 0; i < m.length; i+=2) {
      for (j = 1; j < m[i].length - 1; j+=2) {
        m[i][j] = new Wall(i, j, m[i][j - 1], m[i][j + 1]);
      }
    }
  }

  /* Add walls of a given cell to the wall list */
  function addWalls(i, j) {
    if (typeof matrix[i + 1] !== 'undefined' && typeof matrix[i + 1][j] !== 'undefined') {
      wallList.push(matrix[i + 1][j]);
    }
    if (typeof matrix[i - 1] !== 'undefined' && typeof matrix[i - 1][j] !== 'undefined') {
      wallList.push(matrix[i - 1][j]);
    }
    if (typeof matrix[i] !== 'undefined' && typeof matrix[i][j + 1] !== 'undefined') {
      wallList.push(matrix[i][j + 1]);
    }
    if (typeof matrix[i] !== 'undefined' && typeof matrix[i][j - 1] !== 'undefined') {
      wallList.push(matrix[i][j - 1]);
    }
  }

  var wallList = [], i = startX, j = startY, w, tmpCell;

  createCells(matrix);
  createWalls(matrix);

  /* Mark first cell as part of the maze, push its coordinates to the output stack
   * and add it's walls to the wall list */
  matrix[i][j].visited = true;
  x_coords_out.push(j);
  y_coords_out.push(i);
  addWalls(i, j);

  /* While there are walls in the list */
  while (wallList.length) {
    /* Pick a random wall from the list */
    w = wallList.splice(Math.floor(Math.random() * wallList.length), 1)[0];
    /* Find if the opposite cell has not yet been visited,
     * add it's coordinates to the output stack,
     * add neighboring walls of the cell to the wall list. */
    if (w !== 0 && (!w.left.visited || !w.right.visited)) {
      tmpCell = (!w.left.visited) ? w.left : w.right;
      tmpCell.visited = true;
      x_coords_out.push(w.y, tmpCell.y);
      y_coords_out.push(w.x, tmpCell.x);
      i = tmpCell.x;
      j = tmpCell.y;
      addWalls(i, j);
    }
  }

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
>>>>>>> First pages commit
};