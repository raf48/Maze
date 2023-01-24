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

  // Mark starting cell as visited
  maze.visitCell(startX, startY);
  // Add starting cell to output with no direction
  out.addCellWithDirection(startX, startY, null);

  // Walk until the whole maze is filled with cells
  while (!back || backwards.length) {
    const neighbours = maze.getNeighbours(current_x, current_y);

    if (neighbours.length) {
      let next;
      // Push for backtrack only cells with multiple neighbours
      if (neighbours.length > 1) {
        backwards.push(current_x, current_y);
        // Walk in a random direction
        next = neighbours.getRandom();
      } else {
        next = neighbours[0];
      }
      back = false;
      current_x = next[0];
      current_y = next[1];

      maze.visitCell(current_x, current_y);
      // Store: x, y and direction
      out.addCellWithDirection(current_x, current_y, next[2]);
    } else {
      // Walk backwards
      back = true;
      current_y = backwards.pop();
      current_x = backwards.pop();
    }
  }
};