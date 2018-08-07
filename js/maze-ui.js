<<<<<<< HEAD
<<<<<<< HEAD
class MazeUI {

  constructor() {
    this.mazeCoords = null;
    this.prepareUI();
  }

  /* Print maze stats box */
  printMazeInfo(width, height, genTime, printTime) {
    const stats_str =
     `Maze stats:<br />
      Size: ${width}x${height}<br />
      Gen time: ${genTime} ms<br />
      Print time: ${printTime} ms`;
    document.getElementById('maze_stats').innerHTML = stats_str;
    document.getElementById('solve_stats').innerHTML = '';
  } 

  /* Print solution stats box */
  printSolutionInfo(steps, time) {
    const out = 
     `Solution length: ${steps}<br />
      Solution time: ${time} ms`;
    document.getElementById('solve_stats').innerHTML = out;
  }

  /* Set up/reset the canvas element */
  setUpCanvas() {
    const canvas = document.createElement('canvas');
    const out = document.getElementById('maze');

    canvas.id = 'mazeCanvas';
    canvas.width = MazeUI.STEP_SIZE*(this.width * 2 - 1);
    canvas.height = MazeUI.STEP_SIZE*(this.height * 2 - 1);

    out.innerHTML = '';
    out.appendChild(canvas);
  };

  drawInstant(coordinates, color, reset) {
    if (reset) this.setUpCanvas();

    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const m = coordinates;
    const l = coordinates.x.length;
    const s = MazeUI.STEP_SIZE;
    let i = 0;

    ctx.fillStyle = color;

    this.disableSolveMazeBtn(true);
    while (i < l) {
      ctx.fillRect(m.x[i]*s, m.y[i]*s, s, s);
      i++;
    }
    this.disableSolveMazeBtn(false);
  };

  drawStepByStep(coordinates, color, reset, speed) {
    if (reset) this.setUpCanvas();

    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const m = coordinates;
    const l = coordinates.x.length;
    const s = MazeUI.STEP_SIZE;
    const disableBtn = this.disableSolveMazeBtn;
    let i = 0;

    ctx.fillStyle = color;

    disableBtn(true);
    function step() {
      if (i < l) {
        let j = speed;
        while(j--) {
          ctx.fillRect(m.x[i]*s, m.y[i]*s, s, s);
          i++;
        }
      } else {
        return disableBtn(false);
      }
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  };

  get genType() {
    const checked = document.getElementsByName('genType');

    for (let i = 0; i < checked.length; i++) {
      if (checked[i].checked) {
        return checked[i].value;
      }
    }
  }

  get genAlgorithm() {
    return document.getElementById('genAlgorithm').value;
  }
  get width() {
    return +document.getElementById('x_input').value;
  }
  get height() {
    return +document.getElementById('y_input').value;
  }
  get stepSpeed() {
    return +document.getElementById('step_speed').value;
  }

  disableSolveMazeBtn(bool) {
    document.getElementById('solveMaze').disabled = bool;
  }

  prepareUI() {
    const genSpeedList = document.getElementById('step_speed');
    const genType = document.getElementsByName('genType');
    const btnSolveMaze = document.getElementById('solveMaze');
    const btnGenerateMaze = document.getElementById('generateMaze');
    const rangeX = document.getElementById('x_range');
    const rangeY = document.getElementById('y_range');
    const inputX = document.getElementById('x_input');
    const inputY = document.getElementById('y_input');

    /* Check parameters before anything */
    if (this.width < 2 || this.height < 2) {
      alert('Maze height and width should be more than 2');
      throw RangeError('Maze height and width should be more than 2');
    }

    /* Add listeners */
    genType[MazeUI.INSTANT].addEventListener('click', function() {
      genSpeedList.disabled = true;
    });
    genType[MazeUI.STEP_BY_STEP].addEventListener('click', function() {
      genSpeedList.disabled = false;
    });
    btnGenerateMaze.addEventListener('click', () => this.generateMaze());
    /* When maze has been drawn, then we can solve it */
    btnSolveMaze.addEventListener('click', () => this.solveMaze());
    rangeX.addEventListener('input', function() {
      inputX.value = this.value;
    });
    rangeY.addEventListener('input', function() {
      inputY.value = this.value;
    });
    inputX.addEventListener('input', function() {
      rangeX.value = this.value;
    });
    inputY.addEventListener('input', function() {
      rangeY.value = this.value;
    });

    /* Generate first maze with default params */
    this.generateMaze();
  }

  /* Generate maze and time everything */
  generateMaze() {

    const width = this.width;
    const height = this.height;
    const algorithm = this.genAlgorithm;
    const output = new Printer(width);
    let startTime, genTime, printTime;

    /* Generate maze based on algorithm */
    startTime = Date.now();
    if (algorithm === 'd') {
      genDFS(width, height, output, 0, 0);
    } else if (algorithm === 'k') {
      genKruskal(width, height, output);
    } else if (algorithm === 'p') {
      genPrim(width, height, output, 0, 0, 'heap');
    } else if (algorithm === 'r') {
      genPrim(width, height, output, 0, 0, 'array');
    } else if (algorithm === 'e') {
      genEller(width, height, output);
    }

    /* Convert maze to an array of coordinates */
    if (algorithm === 'd' || algorithm === 'p' || algorithm === 'r') {
      this.mazeCoords = output.cellsToArray();
    } else if (algorithm === 'k') {
      this.mazeCoords = output.wallsToArray();
    } else if (algorithm === 'e') {
      this.mazeCoords = output;
    }
    genTime = Date.now() - startTime;

    /* Output maze on screen */
    if (this.genType == MazeUI.INSTANT) {
      startTime = Date.now();
      this.drawInstant(this.mazeCoords, 'white', true);
      printTime = Date.now() - startTime;
    } else {
      this.drawStepByStep(this.mazeCoords, 'white', true, this.stepSpeed);
      printTime = '-';
    }

    /* Output stats */
    this.printMazeInfo(width, height, genTime, printTime);
    console.log(`time: ${genTime} ms`);
  }

  /* Solve generated maze and time everything */
  solveMaze() {
    const width = this.width;
    const height = this.height;
    let startTime, solveTime;

    /* Construct a negated 2D matrix from mazeCoords array  */
    const matrix = new Maze2D(width*2-1, height*2-1, true);
    for (let i = 0; i < this.mazeCoords.x.length; i++) {
      matrix.unvisit(this.mazeCoords.x[i], this.mazeCoords.y[i]);
    }

    startTime = Date.now();
    const solvedMaze = findSolution(matrix, 0, 0, width*2 - 2, height*2 - 2);
    solveTime = Date.now() - startTime;

    this.drawInstant(solvedMaze, 'red', false);
    this.printSolutionInfo(solvedMaze.x.length, solveTime);
  }
}

// Static properties
MazeUI.INSTANT = 0;
MazeUI.STEP_BY_STEP = 1;
MazeUI.STEP_SIZE = 3;
=======
var G_INSTANT = 0,
    G_STEP_BY_STEP = 1,
=======
var INSTANT = 0,
    STEP_BY_STEP = 1,
>>>>>>> Refactored code
    my_maze;

function printMazeInfo(width, height, time) {
  var out = 'Generated maze:<br />' +
            'Size: ' + width + 'x' + height + '<br/>' +
            'Time: ' + time + ' milliseconds';
  document.getElementById('stats_print').innerHTML = out;        
  document.getElementById('path_print').innerHTML = '';
} 

function printSolutionInfo(time, steps) {
  var out = 'Found path:<br/>' +
            'Length: ' + steps + '<br />' +
            'Time: ' + time + ' milliseconds';
  document.getElementById('path_print').innerHTML = out;
}

function getUIGenType() {
  var checked = document.getElementsByName('genType'),
      i;

  for (i = 0; i < checked.length; i++) {
    if (checked[i].checked) {
      return checked[i].value;
    }
  }
}

function getUIGenAlgorithm() {
  return document.getElementById('genAlgorithm').value;
}

function getUIWidth() {
  return 2*document.getElementById('x_input').value - 1;
}

function getUIHeight() {
  return 2*document.getElementById('y_input').value - 1;
}

function getUIStepSpeed() {
  var speed = document.getElementById('step_speed').value;
  
  switch (speed) {
  case 'very_slow':
    return 1;
    break;
  case 'slow':
    return 5;
    break;
  case 'normal':
    return 20;
    break;
  case 'fast':
    return 100;
    break;
  case 'ultra':
    return 500;
    break;
  default:
    return 0;
    break;
  }
}

function UIChkParams() {
  /* Check parameters */
  if (getUIWidth() < 2 || getUIHeight() < 2) {
    alert('Maze height and width should be more than 2');
    throw RangeError('Maze height and width should be more than 2');
  }
}

function prepareUI() {
  var genSpeedList = document.getElementById('step_speed'),
      genType = document.getElementsByName('genType'),
      btnSolveMaze = document.getElementById('solveMaze'),
      btnGenerateMaze = document.getElementById('generateMaze'),
      rangeX = document.getElementById('x_range'),
      rangeY = document.getElementById('y_range'),
      inputX = document.getElementById('x_input'),
      inputY = document.getElementById('y_input');

  /* Add listeners */
  genType[INSTANT].addEventListener('click', function() {
    genSpeedList.disabled = true;
  });
  genType[STEP_BY_STEP].addEventListener('click', function() {
    genSpeedList.disabled = false;
  });
  btnGenerateMaze.addEventListener('click', function() {
    generateMaze();
  });
  btnSolveMaze.addEventListener('click', function() {
    /* When maze has been drawn, then we can solve it */
    return function() {
      if (my_maze.getPrintStatus()) {
        my_maze.solve();
        my_maze.printSolution();
        printSolutionInfo(my_maze.getSolveTime(), my_maze.getSolutionStepCtx());
      }
    }
  }(my_maze));
  rangeX.addEventListener('input', function() {
    inputX.value = this.value;
  });
  rangeY.addEventListener('input', function() {
    inputY.value = this.value;
  });
  inputX.addEventListener('input', function() {
    rangeX.value = this.value;
  });
  inputY.addEventListener('input', function() {
    rangeY.value = this.value;
  });
}

function generateMaze() {
  /* Check parameters */
  UIChkParams();
  my_maze = new Maze(getUIWidth(), getUIHeight());
  switch (getUIGenAlgorithm()) {
  case 'd':
    my_maze.generate(1, 0, 0);
    break;
  case 'k':
    my_maze.generate(2);
    break;
  case 'p':
    my_maze.generate(3, 0, 0);
    break;
  case 'r':
    my_maze.generate(4, 0, 0);
    break;
  default:
    my_maze.generate(5);
    break;
  }

  if (getUIGenType() == INSTANT) {
    my_maze.printInstant();
  } else {
    my_maze.printStepByStep(getUIStepSpeed());
  }

  printMazeInfo(my_maze.width, my_maze.height, my_maze.getGenTime());
  console.log('time:', my_maze.getGenTime());
}

function loadMaze() {
  prepareUI();
  generateMaze();
}
>>>>>>> First pages commit
