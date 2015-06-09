var G_INSTANT = 0,
    G_STEP_BY_STEP = 1,
    my_maze;

function printStats(width, height, steps, time) {
  var out = '<p>Stats<br/>' +
            'Size: ' + width + 'x' + height + '<br/>' +
            'Steps generated: ' + steps + '<br />' +
            'Time: ' + time + ' milliseconds</p>';
  document.getElementById('stats_print').innerHTML = out;
}

function getUIStartX() {
  return document.getElementById('start_x').value - 1;
}

function getUIStartY() {
  return document.getElementById('start_y').value - 1;
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

function getUIGenAs() {
  return document.getElementById('genAsTable').checked;
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

function getUIThinWalls() {
  return document.getElementById('thinWalls').checked;
}

function getUIStepSpeed() {
  var speed = document.getElementById('step_speed').value;
   
  switch (speed) {
  case 'very_slow':
    return 500;
    break;
  case 'slow':
    return 100;
    break;
  case 'normal':
    return 50;
    break;
  case 'fast':
    return 20;
    break;
  case 'ultra':
    return 1;
    break;
  default:
    return 0;
    break;
  }
}

function prepareUI() {
  var genChkBox = document.getElementById('genAsTable'),
      genSpeedList = document.getElementById('step_speed'),
      genType = document.getElementsByName('genType'),
      genAlgorithm = document.getElementById('genAlgorithm'),
      startX = document.getElementById('start_x'),
      startY = document.getElementById('start_y'),
      x = getUIStartX(),
      y = getUIStartY(),
      width = getUIWidth(),
      height = getUIHeight(),
      btnSolveMaze = document.getElementById('solveMaze');

  // Check parameters
  if (x >= width || x < 0 || y >= height || y < 0) {
    alert('Start coordinates should be between 1 and 1000, step size should be at least 1');
    throw RangeError('Start coordinates should be between 1 and 1000, step size should be at least 1');
  }
  // Add listeners
  genType[G_INSTANT].addEventListener('click', function() {
    genSpeedList.disabled = true;
    genChkBox.disabled = false;
  });
  genType[G_STEP_BY_STEP].addEventListener('click', function() {
    genSpeedList.disabled = false;
    genChkBox.disabled = true;
  });
  genAlgorithm[0].addEventListener('click', function() {
    startX.disabled = false;
    startY.disabled = false;
  });
  genAlgorithm[1].addEventListener('click', function() {
    startX.disabled = true;
    startY.disabled = true;
  });
  genAlgorithm[2].addEventListener('click', function() {
    startX.disabled = false;
    startY.disabled = false;
  });
  btnSolveMaze.addEventListener('click', function() {
    if (my_maze.getPrintStatus()) {
      solveMaze();
    }
  });
}

function generateMaze() {
  my_maze = new Maze(getUIWidth(), getUIHeight());
  switch (getUIGenAlgorithm()) {
  case 'd':
    my_maze.generate(1, getUIStartX(), getUIStartY());
    break;
  case 'k':
    my_maze.generate(2);
    break;
  default :
    my_maze.generate(3, getUIStartX(), getUIStartY());
    break;
  }

  if (getUIGenType() == G_INSTANT) {
    if (getUIGenAs()) {
        my_maze.printInstantAsTable();
    } else {
      my_maze.printInstant(getUIThinWalls());
    }
  } else {
    my_maze.printStepByStep(getUIStepSpeed());
  }

  printStats(my_maze.width, my_maze.height, my_maze.getStepCtx(), my_maze.getTime());
}

function runMaze() {
  prepareUI();
  generateMaze();
}

function solveMaze() {
  my_maze.solve();
}