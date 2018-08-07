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
};