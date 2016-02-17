/* An implementation of randomized Kruskal's algorithm for 2-d maze generation */
function generateK(width, height) {

  var x_coords_out = [],  /* Array used to save generated x-axis coordinates */
      y_coords_out = [],  /* Array used to save generated y-axis coordinates */
      matrix = Array.matrix(width, height, 0), /* 2-dimentional array */
      set = [],           /* Disjoint-set data structure */
      wallList = [],      /* A list of walls */
      w;                  /* Wall iterator */

  function Set(x, y, n) {
    this.x = x;
    this.y = y;
    this.n = n;
  }

  function Wall(x, y, left, right) {
    this.x = x;
    this.y = y;
    this.left = left;
    this.right = right;
  }

  function differentSets(left, right) {
    return !(set[left].indexOf(right) > -1);
  };

  function mergeSets(left, right) {
    var i;
    set[left] = set[left].concat(set[right]);

    i = set[left].length;
    while (i--) {
      set[set[left][i]] = set[left];
    }
  }

  function makeSet(m, s) {
    var i, j, n = 0;
    /* Create a set for each cell containing just that one cell,
       give each set a unique name (n) */
    for (i = 0; i < m.length; i+=2) {
      for (j = 0; j < m[i].length; j+=2) {
        m[i][j] = new Set(i, j, n++);
      }
    }

    /* Fill disjoint-set with initial cell numbers */
    for (i = 0; i < n; i++) {
      s[i] = [i];
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

  /* Fill matrix, initialize set */
  makeSet(matrix, set);

  wallList = createWalls(matrix);
  /* Shuffle array of walls with Knuth shuffle */
  wallList.shuffle();

  /* While there are walls in the list */
  while (wallList.length) {
    w = wallList.pop();
    /* If cells belong to different sets then merge those two sets */
    if (differentSets(w.left.n, w.right.n)) {
      mergeSets(w.left.n, w.right.n);
      x_coords_out.push(w.left.x, w.x, w.right.x);
      y_coords_out.push(w.left.y, w.y, w.right.y);
    }
  }

  /* Return generated solution as an object */
  return {
    x : x_coords_out,
    y : y_coords_out
  };
};