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
    new_maze[maze.x[i]][maze.y[i]] = { x: maze.x[i], y: maze.y[i] };
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
  run({ cx : cx, cy : cy});
  
  return new_maze;
}