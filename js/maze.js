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
      genTime,     /* Running time of maze generation algorithm */
      solveTime,   /* Running time of maze solution finding algorithm */
      maze,        /* Generated maze, returned by the algorithm */
      solution,    /* Solved maze, path from start point to finish */
      printed,     /* Depicts whether maze drawing proccess has finished */
      solutionLength; /* Solution step counter */

  this.width = width;
  this.height = height;

  this.generate = function(algorithm, x, y) {
    var startTime = Date.now();
    if (algorithm === 1) {
      maze = generateD(width, height, matrix, y, x);
    } else if (algorithm === 2) {
      maze = generateK(width, height, matrix);
    } else if (algorithm === 3) {
      maze = generateP(width, height, matrix, y, x);
    }
    genTime = (Date.now() - startTime)*0.001;
  }
 
  this.solve = function() {
    var startTime = Date.now();
    solution = solve(maze, width, height);
    solveTime = (Date.now() - startTime)*0.001;
  }

  this.getGenTime = function() {
    return genTime;
  };

  this.getSolveTime = function() {
    return solveTime;
  };
 
  this.getPrintStatus = function() {
    return printed;
  };
 
  this.getSolutionStepCtx = function() {
    return solutionLength;
  };

  function prepareCanvas() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var out = document.getElementById('output');

    canvas.id = 'mazeCanvas';
    canvas.height = height*6;
    canvas.width = width*6;
    ctx.fillStyle = 'white';

    out.innerHTML = '';
    out.appendChild(canvas);

    return ctx;
  };

  this.printInstant = function() {
    var ctx = prepareCanvas(), i = 0;
    printed = false;
    while (1) {
      if (i < maze.x.length) {
        ctx.fillRect(maze.y[i]*6, maze.x[i]*6, 6, 6);
        i++;
      } else {
        break;
      };
    }
    printed = true;
  };

  this.printStepByStep = function(speed) {
    var ctx = prepareCanvas(), i = 0, j;
    printed = false;

    function step() {
      if (i < maze.x.length) {
        j = speed;
        while(j--) {
          ctx.fillRect(maze.y[i]*6, maze.x[i]*6, 6, 6);
          i++;
        }
      } else {
        return printed = true;
      }

      window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  };
 
  this.printSolution = function() {
    /* Expect that canvas has already been created */
    var canvas = document.getElementById('mazeCanvas'),
        ctx = canvas.getContext('2d'),
        i, j;

    ctx.fillStyle = 'red';
    solutionLength = 0;
    for (i = 0; i < width; i++) {
      for (j = 0; j < height; j++) {
        if (typeof solution[i] !== 'undefined' &&
            typeof solution[i][j] !== 'undefined' &&
            solution[i][j].visited === 1) {
          solutionLength++;
          ctx.fillRect(solution[i][j].x*6, solution[i][j].y*6, 6, 6);
        }
      }
    }
  };
};