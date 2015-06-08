/* An implementation of randomized Kruskal's algorithm for 2-d maze generation */
function generateK(width, height, matrix) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [];  /* Array used to save generated y-axis coordinates */

  function Set(x, y, n) {
    this.x = x;
    this.y = y;
    /* Give each set a unique name */
    this.n = n;

    o[n] = {};
    o[n][n] = true;
  }

  function Wall(x, y, left, right) {
    this.x = x;
    this.y = y;
    this.left = left;
    this.right = right;
  }

  function differentSets(left, right) {
    return !o[left.n][right.n];
  };

  function mergeSets(left, right) {
    var i, j;
    for (i in o[right.n]) {
      for (j in o[left.n]) {
        o[i][j] = true;
      }
    }
    for (i in o[left.n]) {
      for (j in o[right.n]) {
        o[i][j] = true;
      }
    }
  }

  function makeSet(m) {
    var i, j, n = 0;
    for (i = 0; i < m.length; i+=2) {
      for (j = 0; j < m[i].length; j+=2) {
        m[i][j] = new Set(i, j, ++n);
        o[n] = {};
        o[n][n] = true;
      }
    }
  }

  function createWalls(m) {
    var i, j, arr = [];
    /* Create horizontal walls */
    for (i = 1; i < m.length - 1; i+=2) {
      for (j = 0; j < m[i].length; j+=2) {
        arr.push(new Wall(i, j, m[i - 1][j], m[i + 1][j]));
      }
    }

    /* Create vertical walls */
    for (i = 0; i < m.length; i+=2) {
      for (j = 1; j < m[i].length - 1; j+=2) {
        arr.push(new Wall(i, j, m[i][j - 1], m[i][j + 1]));
      }
    }

    return arr;
  }

  var o = {}, wallList = [], w;

  makeSet(matrix);

  wallList = createWalls(matrix);
  wallList.shuffle();

  /* While there are walls in the list */
  while (wallList.length) {
    w = wallList.pop();
    /* If cells belong to different sets then merge those two sets */
    if (differentSets(w.left, w.right)) {
      mergeSets(w.left, w.right);
      x_coords_out.push(w.left.y, w.y, w.right.y);
      y_coords_out.push(w.left.x, w.x, w.right.x);
    }
  }

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
};