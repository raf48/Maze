/*
  Find path between two points on a 2D plain that contains obstacles (walls)
  by walking in any random direction and backtracking when hitting a dead-end
*/
function findSolution(matrix, startX, startY, endX, endY) {

  // Current position holders
  let current_x = startX;
  let current_y = startY;

  // Init output with start coords
  const x_coords_out = [current_x];
  const y_coords_out = [current_y];

  const backwards = []; // For backwards walking
  let   back = false;   // Backwards indicator

  /* Count steps and later use them for backwards walking */
  let stepCount = 0;

  /* Start walking, stop when reached end coords */
  while (current_x !== endX || current_y !== endY) {

    matrix.visitCell(current_x, current_y);
    const directions = matrix.getNeighbours(current_x, current_y);

    if (directions.length) {
      let next;
      // Push for backtrack only cells with multiple directions
      if (directions.length > 1) {
        backwards.push(current_x, current_y, stepCount);
        // Walk in random direction
        next = directions.getRandom();
      } else {
        next = directions[0];
      }
      stepCount++;
      back = false;
      current_x = next[0];
      current_y = next[1];
      x_coords_out.push(current_x);
      y_coords_out.push(current_y);
    } else {
      /* Walk backwards until reaching a junction */
      back = true;
      let backwardsCount = backwards.pop();
      for (let i = backwardsCount; i < stepCount; i++) {
        x_coords_out.pop();
        y_coords_out.pop();
      }
      stepCount = backwardsCount;
      current_y = backwards.pop();
      current_x = backwards.pop();
    }
  }

  return {
    x: x_coords_out,
    y: y_coords_out,
  }
}