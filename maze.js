/*
  1 1 1 1 1
  0 0 1 0 0
  1 1 1 0 0
  1 0 0 0 0
  1 0 0 0 0
*/
var G_LEFT = 0,
    G_RIGHT = 1,
    G_DOWN = 2,
    G_UP = 3,
    G_STEP_SIZE = 2;

// 2-dimentional array
Array.matrix = Array.matrix || function(numrows, numcols, initial) {
  var arr = [], n = 0;
  for(var i = 0; i < numrows; ++i) {
    var columns = [];
    for (var j = 0; j < numcols; ++j) {
      columns[j] = initial;
      arr[i] = columns;
      n++;
    }
  }
  return arr;
};

// Knuth Shuffle
Array.prototype.shuffle = Array.prototype.shuffle || function() {
  var currentIndex = this.length,
      temporaryValue,
      randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    this[randomIndex] = temporaryValue;
  }
};

var Maze = function(width, height) {
  var matrix = Array.matrix(width, height, 0),
      x_cords = [],
      y_cords = [],
      x_cords_out = [],
      y_cords_out = [],
      stepCtx = 0,
      time;

  this.width = width;
  this.height = height;

  var generateD = function(cx, cy) {
  
    function randomDirection(except) {
      var result = Math.floor(Math.random() * 4),
          i;
  
      if (typeof except === 'undefined') {
        return result;
      }
  
      for (i = 0; i < except.length; i++) {
        if (result === except[i]) {
          result = randomDirection(except);
        }
      }
  
      return result;
    }
  
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

    function move(direction) {
      var x = 0, y = 0, sign, i;
      stepCtx++;
      
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
        x_cords_out.push(cx + (i*x*sign));
        y_cords_out.push(cy + (i*y*sign));
        matrix[cy + (i*y*sign)][cx + (i*x*sign)] = 1;
      }
      cy = cy + (sign*y*G_STEP_SIZE);
      cx = cx + (sign*x*G_STEP_SIZE);
    }

    function notBlocking(direction) {
      if (direction === G_LEFT) {
        return cy - G_STEP_SIZE >= 0 && matrix[cy - G_STEP_SIZE][cx] === 0;
      } else if (direction === G_RIGHT) {
        return cy + G_STEP_SIZE < width && matrix[cy + G_STEP_SIZE][cx] === 0;
      } else if (direction === G_DOWN) {
        return cx + G_STEP_SIZE < height && matrix[cy][cx + G_STEP_SIZE] === 0;
      } else {
        return cx - G_STEP_SIZE >= 0 && matrix[cy][cx - G_STEP_SIZE] === 0;
      }
    }

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
      alert('error! this should not happen...');
      break;
    }

    if (!back || x_cords.length && y_cords.length) {
      if (back) {
        generateD(x_cords.pop(), y_cords.pop());
      } else {
        x_cords.push(cx);
        y_cords.push(cy);
        generateD(cx, cy);
      }
    }
  };

  var generateK = function() {

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
      // Create horizontal walls
      for (i = 1; i < m.length - 1; i+=2) {
        for (j = 0; j < m[i].length; j+=2) {
          arr.push(new Wall(i, j, m[i - 1][j], m[i + 1][j]));
        }
      }

      // Create vertical walls
      for (i = 0; i < m.length; i+=2) {
        for (j = 1; j < m[i].length - 1; j+=2) {
          arr.push(new Wall(i, j, m[i][j - 1], m[i][j + 1]));
        }
      }

      return arr;
    }

    var o = {}, wall = [], w;

    makeSet(matrix);

    wall = createWalls(matrix);
    wall.shuffle();

    while (wall.length) {
      w = wall.pop();

      if (differentSets(w.left, w.right)) {
        mergeSets(w.left, w.right);
        x_cords_out.push(w.left.y, w.y, w.right.y);
        y_cords_out.push(w.left.x, w.x, w.right.x);
      }
    }
  };

  this.run = function(algorithm, x, y) {
    var startTime = Date.now();
    if (algorithm === 1) {
      generateD(y, x);
    } else if (algorithm === 2) {
      generateK();
    }
    time = (Date.now() - startTime)*0.001;
  };

  this.getTime = function() {
    return time;
  };

  this.getStepCtx = function() {
    return stepCtx;
  };

  this.getXPath = function() {
    return x_cords_out;
  };

  this.getYPath = function() {
    return y_cords_out;
  };

  function prepareCanvas() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var out = document.getElementById('output');

    canvas.id = 'mazeCanvas';
    canvas.height = height*10;
    canvas.width = width*10;
    ctx.fillStyle = 'white';

    out.innerHTML = '';
    out.appendChild(canvas);

    // Clear possible previous intervals
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    return ctx;
  };

  this.printInstant = function() {
    var ctx = prepareCanvas(), i = 0;
    while (1) {
      if (i < x_cords_out.length) {
        ctx.fillRect(y_cords_out[i]*10, x_cords_out[i]*10, 10, 10);
        i++;
      } else {
        break;
      };
    }
  };

  this.printStepByStep = function(speed) {
    var ctx = prepareCanvas(), i = 0;
    var int = setInterval(function() {
      if (i < x_cords_out.length) {
        ctx.fillRect(y_cords_out[i]*10, x_cords_out[i]*10, 10, 10);
        i++;
      } else {
        clearInterval(int);
      };
    }, speed || 100);
  };

  this.printInstantAsTable = function() {
    var out = '<table class="mazeTable">',
        i, j;

    for (i = 0; i < matrix[0].length; i++) {
      out += '<tr>';
      for (j = 0; j < matrix.length; j++) {
        out += matrix[j][i] ?
          '<td class="route"></td>' :
          '<td class="wall"></td>';
      }
      out += '</tr>';
    }
    out += '</table>';
    document.getElementById('output').innerHTML = out;
  };
};