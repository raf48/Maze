var G_INSTANT = 0,
    G_STEP_BY_STEP = 1,
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
  return +document.getElementById('x_input').value;
}

function getUIHeight() {
  return +document.getElementById('y_input').value;
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
  if (getUIWidth() < 3 || getUIHeight() < 3) {
    alert('Maze height and width should be more than 3');
    throw RangeError('Maze height and width should be more than 3');
  }
}

function prepareUI() {
  var genSpeedList = document.getElementById('step_speed'),
      genType = document.getElementsByName('genType'),
      btnSolveMaze = document.getElementById('solveMaze'),
      btnGenerateMaze = document.getElementById('generateMaze');

  /* Add listeners */
  genType[G_INSTANT].addEventListener('click', function() {
    genSpeedList.disabled = true;
  });
  genType[G_STEP_BY_STEP].addEventListener('click', function() {
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
  default :
    my_maze.generate(3, 0, 0);
    break;
  }

  if (getUIGenType() == G_INSTANT) {
    my_maze.printInstant();
  } else {
    my_maze.printStepByStep(getUIStepSpeed());
  }

  printMazeInfo(my_maze.width, my_maze.height, my_maze.getGenTime());
}

function loadMaze() {
  prepareUI();
  generateMaze();
}