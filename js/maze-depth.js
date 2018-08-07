/*
  Depth-first search implementation with a stack for 2-D maze generation
*/
function genDFS(width, height, out, startX, startY) {

  // Current position holders
  let current_x = startX;
  let current_y = startY;

  const backwards = []; // For backwards walking
  let   back = false;   // Backwards indicator

  // Initialize 2-D maze with empty cells
  const maze = new Maze2D(width, height);

  // Create a starting point
  maze.visit(current_x, current_y);
  out.addCell(current_x, current_y);

  // Start walking
  while (!back || backwards.length) {
    const directions = maze.getDirections(current_x, current_y);

    if (directions.length) {
      let next;
      // Push for backtrack only cells with multiple directions
      if (directions.length > 1) {
        backwards.push(current_x, current_y);
        // Walk in random direction
        next = directions.getRandom();
      } else {
        next = directions[0];
      }
      back = false;
      maze.visit(next[0], next[1]);
      current_x = next[0];
      current_y = next[1];
      out.addCell(next[0], next[1], next[2]);
    } else {
      // Go back
      back = true;
      current_y = backwards.pop();
      current_x = backwards.pop();
    }
  }
};