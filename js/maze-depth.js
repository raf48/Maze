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

  /* Pick a random direction.
   * Optionally we can pass a list of exeptions (unwanted directions).
   */
  function randomDirection(except) {
    var result = Math.floor(Math.random() * 4),
        i;

    if (typeof except === 'undefined') {
      return result;
    }

    /* If direction we just picked is in the exception list - pick another random direction */
    for (i = 0; i < except.length; i++) {
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
  function notBlocking(direction, coords) {
    if (direction === G_LEFT) {
      return coords.cy - G_STEP_SIZE >= 0 && matrix[coords.cy - G_STEP_SIZE][coords.cx] === 0;
    } else if (direction === G_RIGHT) {
      return coords.cy + G_STEP_SIZE < width && matrix[coords.cy + G_STEP_SIZE][coords.cx] === 0;
    } else if (direction === G_DOWN) {
      return coords.cx + G_STEP_SIZE < height && matrix[coords.cy][coords.cx + G_STEP_SIZE] === 0;
    } else {
      return coords.cx - G_STEP_SIZE >= 0 && matrix[coords.cy][coords.cx - G_STEP_SIZE] === 0;
    }
  }

  /* Move in particular direction, mark walked steps as visited */
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
    }
  }

  /* Start recursion */
  walk(startX, startY);

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
};