var G_INSTANT = 0,
    G_STEP_BY_STEP = 1;

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
      startX = getUIStartX(),
      startY = getUIStartY(),
      width = getUIWidth(),
      height = getUIHeight();

  // Check parameters
  if (startX >= width || startX < 0 || startY >= height || startY < 0) {
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
}

function generateMaze() {
  var my_maze = new Maze(getUIWidth(), getUIHeight());
  if (getUIGenAlgorithm() === 'd') {
    my_maze.run(1, getUIStartX(), getUIStartY());
  } else {
    my_maze.run(2);
  }

  if (getUIGenType() == G_INSTANT) {
    if (getUIGenAs()) {
        my_maze.printInstantAsTable();
    } else {
      my_maze.printInstant();
    }
  } else {
    my_maze.printStepByStep(getUIStepSpeed());
  }

  printStats(my_maze.width, my_maze.height, my_maze.getStepCtx(), my_maze.getTime());   
}

function run() {
  prepareUI();
  generateMaze();
}