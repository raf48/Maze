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
      }
    }

    /* Create vertical walls */
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
};