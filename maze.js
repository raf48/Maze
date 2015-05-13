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
    G_UP = 3;

Array.matrix = Array.matrix || function(numrows, numcols, initial) {
  var arr = [];
  for(var i = 0; i < numrows; ++i) {
    var columns = [];
    for (var j = 0; j < numcols; ++j) {
      columns[j] = initial;
      arr[i] = columns;
    }
  }
  return arr;
};

var Maze = function(width, height, stepSize) {
  var matrix = Array.matrix(width, height, 0),
      x_cords = [],
      y_cords = [],
      x_cords_out = [],
      y_cords_out = [],
      stepCtx = 0,
      time;

  this.width = width;
  this.height = height;
  this.stepSize = stepSize;
 
  var prepareCanvas = function prepareCanvas() {
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
  }
 
  var printInstant = function() {
    var ctx = prepareCanvas(), i, j;
    for (i = 0; i < matrix.length; i++) {
      for (j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          ctx.fillRect(i*10, j*10, 10, 10);
        }
      }
    }
  };
 
  var printStepByStep = function(x_path, y_path, speed) {
    var ctx = prepareCanvas(), i = 0;
    var int = setInterval(function() {
      if (i < x_path.length) {
        ctx.fillRect(y_path[i]*10, x_path[i]*10, 10, 10);
        i++;
      } else {
        clearInterval(int);
      };
    }, speed || 100);
  };

  var randomDirection = function(except) {
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
  };

  var generate = function(cx, cy) {

    this.findDirection = function() {
      var direction = randomDirection(),
          exceptions = [];

      while (!this.notBlocking(direction)) {
        if (exceptions.length === 3) {
          return -1;
        }
        exceptions.push(direction);
        direction = randomDirection(exceptions);
      }

      return direction;
    };
 
    this.move = function(direction) {
      var x = 0, y = 0, sign;
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
      for (var i = 0; i <= stepSize; i++) {
        x_cords_out.push(cx + (i*x*sign));
        y_cords_out.push(cy + (i*y*sign));
        matrix[cy + (i*y*sign)][cx + (i*x*sign)] = 1;
      }
      cy = cy + (sign*y*stepSize);
      cx = cx + (sign*x*stepSize);
    };
 
    this.notBlocking = function(direction) {
      if (direction === G_LEFT) {
        return cy - stepSize >= 0 && matrix[cy - stepSize][cx] === 0;
      } else if (direction === G_RIGHT) {
        return cy + stepSize < width && matrix[cy + stepSize][cx] === 0;
      } else if (direction === G_DOWN) {
        return cx + stepSize < height && matrix[cy][cx + stepSize] === 0;
      } else {                                       
        return cx - stepSize >= 0 && matrix[cy][cx - stepSize] === 0;
      }
    };
   
    var back = false;
    var dir = this.findDirection();

    switch (dir) {
    case -1:
      back = true;
      break;
    case G_LEFT:
      this.move(G_LEFT);
      break;
    case G_RIGHT:
      this.move(G_RIGHT);
      break;
    case G_DOWN:
      this.move(G_DOWN);
      break;
    case G_UP:
      this.move(G_UP);
      break;
    default:
      alert('error! this should not happen...');
      break;
    }
   
    if (!back || x_cords.length && y_cords.length) {
      if (back) {
        generate(x_cords.pop(), y_cords.pop());
      } else {
        x_cords.push(cx);
        y_cords.push(cy);
        generate(cx, cy);
      }
    }
  };

  this.run = function run(x, y) {
    var startTime = Date.now();
    generate(y, x);
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

  this.printInstant = printInstant;
  this.printStepByStep = printStepByStep;

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