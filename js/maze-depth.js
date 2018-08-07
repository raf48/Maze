<<<<<<< HEAD
<<<<<<< HEAD
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
=======
/* An implementation of depth-first search algorithm for 2-d maze generation */
function generateD(width, height, matrix, startX, startY) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [],  /* Array used to save generated y-axis coordinates */
      x_back = [],  /* Array used for backward walking the x-axis */
      y_back = [],  /* Array used for backward walking the y-axis */
      G_LEFT = 0,
      G_RIGHT = 1,
      G_DOWN = 2,
      G_UP = 3,
      G_STEP_SIZE = 2;
=======
/* An implementation of depth-first search algorithm with stack for 2-d maze generation */
function generateD(width, height, startX, startY) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [],  /* Array used to save generated y-axis coordinates */
      x_back = [],        /* Array used for backward walking the x-axis */
      y_back = [],        /* Array used for backward walking the y-axis */
      current = { x : startX, y : startY },    /* Current position holder */
      matrix = Array.matrix(width, height, 0), /* 2-dimentional array */
      back = false,
      LEFT = 0,
      RIGHT = 1,
      DOWN = 2;
>>>>>>> Refactored code

  /* Pick a random direction.
   * Optionally we can pass a list of exeptions (unwanted directions).
   */
  function randomDirection(except) {
    var result = Math.floor(Math.random() * 4)

    if (typeof except === 'undefined') {
      return result;
    }

    /* If direction we just picked is in the exception list - pick another random direction */
    for (var i = 0; i < except.length; i++) {
      if (result === except[i]) {
        result = randomDirection(except);
      }
    }

    return result;
  }

  /* Find a random direction to move. If it's not possible to move return -1 */
  function findDirection(coords) {
    var direction = randomDirection(),
        exceptions = [];

    while (!notBlocking(direction, coords)) {
      if (exceptions.length === 3) {
        return -1;
      }
      exceptions.push(direction);
      direction = randomDirection(exceptions);
    }

    return direction;
  }

  /* Check's if we can move in that particular direction */
<<<<<<< HEAD
  function notBlocking(direction, coords) {
    if (direction === G_LEFT) {
      return coords.cy - G_STEP_SIZE >= 0 && matrix[coords.cy - G_STEP_SIZE][coords.cx] === 0;
    } else if (direction === G_RIGHT) {
      return coords.cy + G_STEP_SIZE < width && matrix[coords.cy + G_STEP_SIZE][coords.cx] === 0;
    } else if (direction === G_DOWN) {
      return coords.cx + G_STEP_SIZE < height && matrix[coords.cy][coords.cx + G_STEP_SIZE] === 0;
    } else {
      return coords.cx - G_STEP_SIZE >= 0 && matrix[coords.cy][coords.cx - G_STEP_SIZE] === 0;
=======
  function notBlocking(direction) {
    if (direction === LEFT) {
      return current.x - 2 >= 0 && matrix[current.x - 2][current.y] === 0;
    } else if (direction === RIGHT) {
      return current.x + 2 < width && matrix[current.x + 2][current.y] === 0;
    } else if (direction === DOWN) {
      return current.y + 2 < height && matrix[current.x][current.y + 2] === 0;
    } else {
      return current.y - 2 >= 0 && matrix[current.x][current.y - 2] === 0;
>>>>>>> Refactored code
    }
  }

  /* Move in particular direction, mark walked steps as visited */
<<<<<<< HEAD
  function move(direction, coords) {
    var x = 0, y = 0, sign, i;

    if (direction === G_LEFT) {
      sign = -1;
      y = 1;
    } else if (direction === G_RIGHT) {
      sign = 1;
      y = 1;
    } else if (direction === G_DOWN) {
      sign = 1;
      x = 1;
    } else {
      sign = -1;
      x = 1;
    }
    for (i = 0; i <= G_STEP_SIZE; i++) {
      x_coords_out.push(coords.cx + (i*x*sign));
      y_coords_out.push(coords.cy + (i*y*sign));
      matrix[coords.cy + (i*y*sign)][coords.cx + (i*x*sign)] = 1;
    }
    coords.cx = coords.cx + (sign*x*G_STEP_SIZE);
    coords.cy = coords.cy + (sign*y*G_STEP_SIZE);
  }

  function walk(cx, cy) {
    var back = false,
        coords = { cx : cx, cy : cy },
        dir = findDirection(coords);

    switch (dir) {
    case -1:
      back = true;
      break;
    case G_LEFT:
      move(G_LEFT, coords);
      break;
    case G_RIGHT:
      move(G_RIGHT, coords);
      break;
    case G_DOWN:
      move(G_DOWN, coords);
      break;
    case G_UP:
      move(G_UP, coords);
      break;
    default:
      alert('Error! this should never happen...');
      break;
    }

    if (!back || x_back.length) {
      if (back) {
        walk(x_back.pop(), y_back.pop());
      } else {
        x_back.push(coords.cx);
        y_back.push(coords.cy);
        walk(coords.cx, coords.cy);
      }
=======
  function move(direction) {
    var x = 0, y = 0, sign;

    switch (direction) {
    case LEFT:
      sign = -1;
      x = 1;
      break;
    case RIGHT:
      sign = 1;
      x = 1;
      break;
    case DOWN:
      sign = 1;
      y = 1;
      break;
    default:
      sign = -1;
      y = 1;
      break;
    }

    for (var i = 0; i <= 2; i++) {
      x_coords_out.push(current.x + (i*x*sign));
      y_coords_out.push(current.y + (i*y*sign));
      matrix[current.x + (i*x*sign)][current.y + (i*y*sign)] = 1;
    }
    current.x = current.x + (sign*x*2);
    current.y = current.y + (sign*y*2);

    return false;
  }

  function walk() {
    var dir = findDirection();
    return (dir === - 1) ? true : move(dir);
  }

  /* Start looping */
  while (!back || x_back.length) {
    if (back) {
      current.x = x_back.pop();
      current.y = y_back.pop();
    } else {
      x_back.push(current.x);
      y_back.push(current.y);
>>>>>>> Refactored code
    }
    back = walk();
  }

  /* Start recursion */
  walk(startX, startY);

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
<<<<<<< HEAD
>>>>>>> First pages commit
=======
>>>>>>> Refactored code
};