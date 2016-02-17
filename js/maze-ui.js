var INSTANT = 0,
    STEP_BY_STEP = 1,
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