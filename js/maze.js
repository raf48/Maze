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
  var genTime,     /* Running time of maze generation algorithm */
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
      maze = generateD(width, height, x, y);
    } else if (algorithm === 2) {
      maze = generateK(width, height);
    } else if (algorithm === 3) {
      maze = generateP(width, height, x, y);
    } else if (algorithm === 4) {
      maze = generateR(width, height, x, y);
    } else if (algorithm === 5) {
      maze = generateE(width, height);
    }
    genTime = (Date.now() - startTime)*0.001;
  }
 
  this.solve = function() {
    var startTime = Date.now();
    solution = solve(maze, width, height);
    solveTime = (Date.now() - startTime)*0.001;
  }

  this.getGenTime = function() {
    return genTime.toString().substr(0, 5);
  };

  this.getSolveTime = function() {
    return solveTime.toString().substr(0, 5);
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
    canvas.height = height*5;
    canvas.width = width*5;
    ctx.fillStyle = 'white';

    out.innerHTML = '';
    out.appendChild(canvas);

    return ctx;
  };

  this.printInstant = function() {
    var ctx = prepareCanvas(), i = 0, l = maze.x.length;
    printed = false;
    while (i < l) {
      ctx.fillRect(maze.x[i]*5, maze.y[i]*5, 5, 5);
      i++;
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
          ctx.fillRect(maze.x[i]*5, maze.y[i]*5, 5, 5);
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
          ctx.fillRect(solution[i][j].x*5, solution[i][j].y*5, 5, 5);
        }
      }
    }
  };
};