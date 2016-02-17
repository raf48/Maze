/* An implementation of depth-first search algorithm with stack for 2-d maze generation */
function generateD(width, height, matrix, startX, startY) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [],  /* Array used to save generated y-axis coordinates */
      x_back = [],        /* Array used for backward walking the x-axis */
      y_back = [],        /* Array used for backward walking the y-axis */
      current = { x : startX, y : startY },  /* Current position holder */
      back = false,
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
  function findDirection() {
    var direction = randomDirection(),
        exceptions = [];

    while (!notBlocking(direction)) {
      if (exceptions.length === 3) {
        return -1;
      }
      exceptions.push(direction);
      direction = randomDirection(exceptions);
    }

    return direction;
  }

  /* Check's if we can move in that particular direction */
  function notBlocking(direction) {
    if (direction === G_LEFT) {
      return current.y - G_STEP_SIZE >= 0 && matrix[current.y - G_STEP_SIZE][current.x] === 0;
    } else if (direction === G_RIGHT) {
      return current.y + G_STEP_SIZE < width && matrix[current.y + G_STEP_SIZE][current.x] === 0;
    } else if (direction === G_DOWN) {
      return current.x + G_STEP_SIZE < height && matrix[current.y][current.x + G_STEP_SIZE] === 0;
    } else {
      return current.x - G_STEP_SIZE >= 0 && matrix[current.y][current.x - G_STEP_SIZE] === 0;
    }
  }

  /* Move in particular direction, mark walked steps as visited */
  function move(direction) {
    var x = 0, y = 0, sign, i;

    switch (direction) {
    case G_LEFT:
      sign = -1;
      y = 1;
      break;
    case G_RIGHT:
      sign = 1;
      y = 1;
      break;
    case G_DOWN:
      sign = 1;
      x = 1;
      break;
    default:
      sign = -1;
      x = 1;
      break;
    }

    for (i = 0; i <= G_STEP_SIZE; i++) {
      x_coords_out.push(current.x + (i*x*sign));
      y_coords_out.push(current.y + (i*y*sign));
      matrix[current.y + (i*y*sign)][current.x + (i*x*sign)] = 1;
    }
    current.x = current.x + (sign*x*G_STEP_SIZE);
    current.y = current.y + (sign*y*G_STEP_SIZE);
  }

  function walk() {
    var back = false,
        dir = findDirection();

    switch (dir) {
    case -1:
      back = true;
      break;
    case G_LEFT:
      move(G_LEFT);
      break;
    case G_RIGHT:
      move(G_RIGHT);
      break;
    case G_DOWN:
      move(G_DOWN);
      break;
    case G_UP:
      move(G_UP);
      break;
    default:
      alert('Error! this should never happen...');
      break;
    }

    return back;
  }

  /* Start looping */
  while (!back || x_back.length) {
    if (back) {
      current.x = x_back.pop();
      current.y = y_back.pop();
      back = walk();
    } else {
      x_back.push(current.x);
      y_back.push(current.y);
      back = walk();
    }
  }

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
};
