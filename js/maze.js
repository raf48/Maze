/* 2-dimentional array */
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

/* Knuth Shuffle */
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

/* Main object */
var Maze = function(width, height) {
  var matrix = Array.matrix(width, height, 0),
      time,     /* The running time of this algorithm */
      solution; /* Generated solution, returned by the algorithm */ 

  this.run = function(algorithm, x, y) {
    var startTime = Date.now();
    if (algorithm === 1) {
      solution = generateD(width, height, matrix, y, x);
    } else if (algorithm === 2) {
      solution = generateK(width, height, matrix);
    } else if (algorithm === 3) {
      solution = generateP(width, height, matrix, y, x);
    }
    time = (Date.now() - startTime)*0.001;
  };

  this.getTime = function() {
    return time;
  };

  this.getStepCtx = function() {
    return solution.x.length;
  };

  function prepareCanvas(thinWalls) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var out = document.getElementById('output');

    canvas.id = 'mazeCanvas';
    canvas.height = (thinWalls) ? height*9.25 : height*10;
    canvas.width = (thinWalls) ? width*9.25 : width*10;
    ctx.fillStyle = 'white';

    out.innerHTML = '';
    out.appendChild(canvas);

    /* Clear possible previous intervals */
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    return ctx;
  };

  this.printInstant = function() {
    var ctx = prepareCanvas(), i = 0;
    while (1) {
      if (i < solution.x.length) {
        ctx.fillRect(solution.y[i]*10, solution.x[i]*10, 10, 10);
        i++;
      } else {
        break;
      };
    }
  };

  /* Same as printInstant, only wrapped inside a setInterval() */
  this.printStepByStep = function(speed) {
    var ctx = prepareCanvas(), i = 0;
    var int = setInterval(function() {
      if (i < solution.x.length) {
        ctx.fillRect(solution.y[i]*10, solution.x[i]*10, 10, 10);
        i++;
      } else {
        clearInterval(int);
      };
    }, speed || 100);
  };

  this.printInstantAsTable = function() {
    var out = '<table class="mazeTable">',
        i, j, outMatrix = new Array.matrix(width, height, 0);

    /* Fill matrix with generated values */
    for (i = 0; i < solution.y.length; i++) {
      outMatrix[solution.y[i]][solution.x[i]] = 1;
    }

    /* Fill table with matrix elements */
    for (i = 0; i < outMatrix[0].length; i++) {
      out += '<tr>';
      for (j = 0; j < outMatrix.length; j++) {
        out += outMatrix[j][i] ?
          '<td class="route"></td>' :
          '<td class="wall"></td>';
      }
      out += '</tr>';
    }
    out += '</table>';
    document.getElementById('output').innerHTML = out;
  };
};