<<<<<<< HEAD
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

    matrix.visit(current_x, current_y);
    const directions = matrix.getDirections(current_x, current_y);

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
=======
function solve(maze, width, height) {

  var new_maze = Array.matrix(width, height, undefined),
      cx = 0, cy = 0, /* Start coordinates */
      endX = (width % 2) ? width - 1 : width - 2, /* End cell coordinates */
      endY = (height % 2) ? height - 1 : height - 2,
      found = false,  /* Indicates whether a solution has been found */
      currentStep,    /* Current step iterator */
      goBack = false, /* Indicates if we need to take a step back */
      i, j;

  /* Move in a certain direction */
  function move(coords, direction) {
    if (direction === 'e') {
      coords.cx += 2;
    } else if (direction === 'w') {
      coords.cx -= 2;
    } else if (direction === 's') {
      coords.cy += 2;
    } else if (direction === 'n') {
      coords.cy -= 2;
    }
  }

  /* 
    Describes how many times a certain path was visited,
    @times:
      0 - Never visited
      1 - Visited once
      2 - Visited twice
  */
  function isNotVisited(x, y, direction, times) {
    var tmpCoords = { cx : x, cy : y };
    move(tmpCoords, direction);
    return new_maze[tmpCoords.cx][tmpCoords.cy].visited == times;
  }

  function run(coords) {
    while (!found) {
      currentStep = new_maze[coords.cx][coords.cy];
      if (currentStep.visited < 2) {
        currentStep.visited++;
      }
      /* Stop solving maze when we reach the last cell */
      if (coords.cx === endX && coords.cy === endY) {
        found = true;
      } else {
        /* Try to move in any direction */
        if (currentStep.s && isNotVisited(coords.cx, coords.cy, 's', goBack)) {
          new_maze[coords.cx][coords.cy + 1].visited++; 
          move(coords, 's');
          if (!goBack) {
            currentStep.visited = 1;
          }
          goBack = false;
        } else if (currentStep.n && isNotVisited(coords.cx, coords.cy, 'n', goBack)) {
          new_maze[coords.cx][coords.cy - 1].visited++;
          move(coords, 'n');
          if (!goBack) {
            currentStep.visited = 1;
          }
          goBack = false;
        } else if (currentStep.e && isNotVisited(coords.cx, coords.cy, 'e', goBack)) {
          new_maze[coords.cx + 1][coords.cy].visited++;
          move(coords, 'e');
          if (!goBack) {
            currentStep.visited = 1;
          }
          goBack = false;
        } else if (currentStep.w && isNotVisited(coords.cx, coords.cy, 'w', goBack)) {
          new_maze[coords.cx - 1][coords.cy].visited++;
          move(coords, 'w');
          if (!goBack) {
            currentStep.visited = 1;
          }
          goBack = false;
        /* Else go back */
        } else {
          goBack = true;
        }
      }
    }
  }

  /* Fill maze with cells */
  for (i = 0; i < maze.y.length; i++) {
    new_maze[maze.y[i]][maze.x[i]] = { x: maze.y[i], y: maze.x[i] };
  }

  /* Set cells with available directions */
  for (i = 0; i < new_maze.length; i+=2) {
    for (j = 0; j < new_maze[i].length; j+=2) {
      if (typeof new_maze[i] !== 'undefined' && typeof new_maze[i][j] !== 'undefined') {
        new_maze[i][j].visited = 0;
        if (typeof new_maze[i + 1] !== 'undefined' && typeof new_maze[i + 1][j] !== 'undefined') {
          new_maze[i + 1][j].visited = 0;
          new_maze[i][j].e = true;
        }
        if (typeof new_maze[i - 1] !== 'undefined' && typeof new_maze[i - 1][j] !== 'undefined') {
          new_maze[i - 1][j].visited = 0;
          new_maze[i][j].w = true;
        }
        if (typeof new_maze[i][j + 1] !== 'undefined') {
          new_maze[i][j + 1].visited = 0;
          new_maze[i][j].s = true;
        }
        if (typeof new_maze[i][j - 1] !== 'undefined') {
          new_maze[i][j - 1].visited = 0;
          new_maze[i][j].n = true;
        }
      }
    }
  }

  /* Run path finding algorithm, pass starting coordinates as an object */
  run({cx, cy});
  
  return new_maze;
>>>>>>> First pages commit
}