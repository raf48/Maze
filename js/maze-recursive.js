/*
  An implementation of Recursive Division for 2-D maze generation
*/
function genRecursive(width, height, out) {
  // Random number between min and max inclusive
  const ran = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

  const horizontal_divide = function(x1, y1, x2, y2) {
    const x = ran(x1, x2);
    const y = ran(y1, y2 - 1);

    out.addHorizontalWall(x1, x2, x, y);

    divide(x1, y1, x2, y); // top
    divide(x1, y + 1, x2, y2); // bottom
  }

  const vertical_divide = function(x1, y1, x2, y2) {
    const x = ran(x1, x2 - 1);
    const y = ran(y1, y2);

    out.addVerticalWall(y1, y2, x, y);

    divide(x1, y1, x, y2); // left
    divide(x + 1, y1, x2, y2); // right
  }

  const divide = function(x1, y1, x2, y2) {
    if (x2 - x1 < 1 || y2 - y1 < 1) return;

    if (x2 - x1 < y2 - y1) {
      horizontal_divide(x1, y1, x2, y2);
    } else {
      vertical_divide(x1, y1, x2, y2);
    }
  };

  divide(0, 0, width - 1, height - 1); // one less because we start from zero
};