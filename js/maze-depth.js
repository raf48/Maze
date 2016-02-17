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
    if (direction === LEFT) {
      return current.x - 2 >= 0 && matrix[current.x - 2][current.y] === 0;
    } else if (direction === RIGHT) {
      return current.x + 2 < width && matrix[current.x + 2][current.y] === 0;
    } else if (direction === DOWN) {
      return current.y + 2 < height && matrix[current.x][current.y + 2] === 0;
    } else {
      return current.y - 2 >= 0 && matrix[current.x][current.y - 2] === 0;
    }
  }

  /* Move in particular direction, mark walked steps as visited */
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
    }
    back = walk();
  }

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
};