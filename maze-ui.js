var G_UP = 0,
    G_DOWN = 1,
    G_RIGHT = 2,
    G_LEFT = 3,
    G_INSTANT = 0,
    G_STEP_BY_STEP = 1;

function printStats(width, height, stepSize, steps, time) {
  var out = '<p>Stats<br/>' +
            'Size: ' + width + 'x' + height + '<br/>' +
            'Step size: ' + stepSize + '<br/>' +
            'Steps generated: ' + steps + '<br />' +
            'Time: ' + time + ' milliseconds</p>';
     document.getElementById('stats_print').innerHTML = out;
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

function getUICordsX() {
    return +document.getElementById('x_input').value;
}

function getUICordsY() {
    return +document.getElementById('y_input').value;
}

function getUIStepSize() {
    return +document.getElementById('step_input').value;
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
        genType = document.getElementsByName('genType');

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
    var my_maze = new Maze(getUICordsX(), getUICordsY(), getUIStepSize());
    my_maze.run(0, 0);

    if (getUIGenType() == G_INSTANT) {
        if (getUIGenAs()) {
            my_maze.printInstantAsTable();
        } else {
            my_maze.printInstant();
        }
    } else {
        my_maze.printStepByStep(my_maze.getXPath(), my_maze.getYPath(), getUIStepSpeed());
    }

    printStats(my_maze.width, my_maze.height, my_maze.stepSize, my_maze.getStepCtx(), my_maze.getTime());   
}

prepareUI();
generateMaze();