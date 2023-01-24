/*
  Main object that contains 2D maze and all its methods
*/
class Maze2D {

  constructor(width, height, initValue) {
    this.width = width;
    this.height = height;

    const value = initValue || false;
    // Initialize maze as 2-D array containing "initValue"
    this.maze = [];
    for (let i = 0; i < width; i++) {
      this.maze[i] = [];
      for (let j = 0; j < height; this.maze[i][j++] = value);
    }
  }

  /* Mark cell as visited */
  visitCell(x, y) {
    this.maze[x][y] = true;
  }

  /* Mark cell as not visited */
  unvisitCell(x, y) {
    this.maze[x][y] = false;
  }

  isVisited(x, y) {
    return this.maze[x][y];
  }

  canNorth(x, y) { return y - 1 >= 0 && !this.maze[x][y - 1]; }
  north(x, y) { return [x, y - 1, Maze2D.NORTH]; }

  canEast(x, y) { return x + 1 < this.width && !this.maze[x + 1][y]; }
  east(x, y) { return [x + 1, y, Maze2D.EAST]; }

  canSouth(x, y) { return y + 1 < this.height && !this.maze[x][y + 1]; }
  south(x, y) { return [x, y + 1, Maze2D.SOUTH]; }

  canWest(x, y) { return x - 1 >= 0 && !this.maze[x - 1][y]; }
  west(x, y) { return [x - 1, y, Maze2D.WEST]; }

  /* Return all available neighbour cells based on input coordinates
   * Direction = [neighbour_x, neighbour_y, direction to neighbour cell] */
  getNeighbours(x, y) {
    const directions = [];

    if (this.canNorth(x, y)) directions.push(this.north(x, y));
    if (this.canEast(x, y)) directions.push(this.east(x, y));
    if (this.canSouth(x, y)) directions.push(this.south(x, y));
    if (this.canWest(x, y)) directions.push(this.west(x, y));

    return directions;
  }

  /* Init walls object based on storage data structure */
  initWalls(dataStructure) {

    if (dataStructure === 'heap') {
      this.walls = new MinHeap();
    } else {
      this.walls = new ExtArray();
    }

    /* Extended array implementation */
    function ExtArray() {
      const data = [];

      return {
        insert: (val) => data.push(val),
        remove: () => data.removeRandom(),
        notEmpty: () => data.length > 0,
        data: data
      }
    };

    /* Binary heap implementation */
    function MinHeap() {
      const data = [null]; // Root element is null

      function insert(el) {
        el.weight = Math.random();
        _bubble(data.push(el) - 1);
      }
      function remove() {
        const r = data[1];
        data[1] = data.pop();
        _sink(1);
        return r;
      }
      function _bubble(i) {
        const parentIndex = Math.floor(i/2);
        if (data[parentIndex] && data[parentIndex].weight > data[i].weight) {
          _swap(i, parentIndex);
          _bubble(parentIndex);
        }
      }
      function _swap(i, j) {
        // Note: currently faster than swapping values with ES6 destructuring
        let tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
      }
      function _sink(i) {
        if (!data[i*2] || !data[i*2 + 1]) return;

        let leftSmaller = data[i*2].weight < data[i*2 + 1].weight;
        let childIndex = leftSmaller ? i*2 : i*2 + 1;

        if (data[i].weight > data[childIndex].weight) {
          _swap(i, childIndex);
          if (childIndex*2 + 1 < data.length) {
            _sink(childIndex);
          }
        }
      }
      function childExists() {
        return !!data[2];
      }

      return {
        insert: insert,
        remove: remove,
        notEmpty: childExists,
        data: data
      }
    }
  }

  /* Add walls to storage */
  addWalls(x, y) {
    const dir = this.getNeighbours(x, y);

    for (let i = 0; i < dir.length; i++) {
      // Insert into data structure
      this.walls.insert({
        x: dir[i][0],
        y: dir[i][1],
        direction: dir[i][2]
      });
    }
  }
}

// Static properties
Maze2D.NORTH = 0;
Maze2D.EAST  = 1;
Maze2D.SOUTH = 2;
Maze2D.WEST  = 3;