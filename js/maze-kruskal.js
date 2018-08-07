<<<<<<< HEAD
<<<<<<< HEAD
/*
  An implementation of randomized Kruskal's algorithm for finding a
  minimum-spanning-tree using weighted quick-union with path compression
*/
function genKruskal(width, height, out) {

  function differentSets(left, right) {
    return find(left) !== find(right);
  };

  function find(p) {
    while (p != set[p]) {
      set[p] = set[set[p]]; /* Path compression */
      p = set[p];
    }
    return p;
  }

  function mergeSets(left, right) {
    let leftRoot = find(left);
    let rightRoot = find(right);

    if (leftRoot === rightRoot) return;

    /* Make smaller root point to larger one */
    if (size[left] < size[right]) {
      set[leftRoot] = rightRoot;
      size[rightRoot] += size[leftRoot];
    } else {
      set[rightRoot] = leftRoot;
      size[leftRoot] += size[rightRoot];
    }

    count--;
  }

  function initSets(n, set, size) {
    /* Fill with initial cell numbers */
    for (let i = 0; i < n; set[i] = i++);
    /* Fill with initial size number */
    for (let i = 0; i < n; size[i++] = 1);
  }

  function createWalls(width, height) {
    const walls = [];

    /* Wall => { left: Number, right: Number } */

    /* Create horizontal walls */
    for (let i = 0; i < height; i++) {
      let w = width * i;
      for (let j = 0; j < width - 1; j++) {
        walls.push({left: j + w, right: j + w + 1});
=======
=======
>>>>>>> GH pages update
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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    return !(set[left.n].indexOf(right.n) > -1);
=======
    return !(set[left].indexOf(right) > -1);
>>>>>>> Refactored code
  };

  function mergeSets(left, right) {
    var i;
    set[left] = set[left].concat(set[right]);

    i = set[left].length;
    while (i--) {
<<<<<<< HEAD
      set[set[r][i]] = set[l];
    }

    i = set[l].length;
    while (i--) {
      set[set[l][i]] = set[r];
>>>>>>> GH pages update
=======
      set[set[left][i]] = set[left];
>>>>>>> Refactored code
    }
  }

  function makeSet(m, s) {
    var i, j, n = 0;
    /* Create a set for each cell containing just that one cell,
       give each set a unique name (n) */
    for (i = 0; i < m.length; i+=2) {
      for (j = 0; j < m[i].length; j+=2) {
        m[i][j] = new Set(i, j, ++n);
        o[n] = {};
        o[n][n] = true;
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
>>>>>>> First pages commit
      }
    }

    /* Create vertical walls */
<<<<<<< HEAD
    for (let i = 0; i < height - 1; i++) {
      let h = width * i;
      for (let j = 0; j < width; j++) {
        walls.push({left: j + h, right: j + h + width});
      }
    }

    return walls;
  }

  const set = [];
  const size = [];
  let count = width*height - 1;

  /* Initialize sets */
  initSets(width*height, set, size);

  /* Create a list of walls */
  const wallList = createWalls(width, height);

  /* Shuffle walls with Knuth's shuffle */
  wallList.shuffle();

  /* While there exists at least one different set */
  while (count) {
    let wall = wallList.pop();
    /* Merge two walls from different sets */
    if (differentSets(wall.left, wall.right)) {
      mergeSets(wall.left, wall.right);
      out.addWall(wall.left, wall.right);
    }
  }
=======
    for (i = 0; i < m.length; i+=2) {
      for (j = 1; j < m[i].length - 1; j+=2) {
        arr.push(new Wall(i, j, m[i][j - 1], m[i][j + 1]));
      }
    }

    return arr;
  }

<<<<<<< HEAD
  var o = {}, wallList = [], w;

  makeSet(matrix);
=======
  /* Fill matrix, initialize set */
  makeSet(matrix, set);
>>>>>>> GH pages update

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
<<<<<<< HEAD
>>>>>>> First pages commit
=======
>>>>>>> Refactored code
};