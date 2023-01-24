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
      Solve time: ${time} ms`;
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

  /**
   * Main draw maze method
   * Draws maze on canvas based on passed parameters
   * @param {drawMethod} drawMethod - 2d array which contains maze coord values
   * @param {number} coordinates - the length of the 2d array
   * @param {string} color - color used to draw objects
   *   white for paths, black for walls and red for maze solution
   * @param {bool} reset - reset canvas first before drawing
   * @param {bool} drawWalls - draw walls and not paths
   * @param {number} speed - draw animation speed, not used when drawing instant
   */
  drawMaze(drawMethod, coordinates, color, reset, drawWalls, speed) {
    if (reset) this.setUpCanvas();

    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const matrix = coordinates;
    const length = coordinates.x.length;
    const step_size = MazeUI.STEP_SIZE;
    const disableUIFunc = this.disableSolveMazeBtn;

    // if drawing walls then fill canvas with white
    if (drawWalls) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = color;

    // execute the drawing method that's requested
    // two drawing methods are available: either draw instantly
    // or draw using a step-by-step animation
    drawMethod(matrix, length, step_size, ctx, disableUIFunc, speed);
  };

  /**
   * Draw maze instantly
   * @param {number[][]} matrix - 2d array which contains maze coord values
   * @param {number} length - the length of the 2d array
   * @param {number} step_size - size of each step, UI static property
   * @param {Object} ctx - canvas context
   * @param {disableUIFunc} disableUIFunc - disable UI elements while drawing
   */
  drawInstant(m, l, s, ctx, disableUI) {
    let i = 0;

    disableUI(true);  // block UI while drawing
    while (i < l) {
      ctx.fillRect(m.x[i]*s, m.y[i]*s, s, s);
      i++;
    }
    disableUI(false);  // unblock UI when done
  }

  /**
   * Draw each step of the maze separately
   * @param {number[][]} matrix - 2d array which contains maze coord values
   * @param {number} length - the length of the 2d array
   * @param {number} step_size - size of each step, UI static property
   * @param {Object} ctx - canvas context
   * @param {disableUIFunc} disableUIFunc - disable UI elements while drawing
   * @param {number} speed - draw animation speed
   */
  drawStepByStep(m, l, s, ctx, disableUI, speed) {
    let i = 0;

    disableUI(true);  // block UI while drawing
    function step() {
      if (i < l) {
        let j = speed;
        while(j--) {
          ctx.fillRect(m.x[i]*s, m.y[i]*s, s, s);
          i++;
        }
      } else {
        return disableUI(false);  // unblock UI when done
      }
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

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

    // Add listeners
    genType[MazeUI.INSTANT].addEventListener('click', function() {
      genSpeedList.disabled = true;
    });
    genType[MazeUI.STEP_BY_STEP].addEventListener('click', function() {
      genSpeedList.disabled = false;
    });
    btnGenerateMaze.addEventListener('click', () => this.generateMaze());
    // When maze has been drawn, then we can solve it
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

    // Generate first maze with default params
    this.generateMaze();
  }

  /* Generate maze and time everything */
  generateMaze() {
    const width = this.width;
    const height = this.height;
    const algorithm = this.genAlgorithm;
    const output = new Printer(width);
    let startTime, genTime, printTime;
    let invert = false;  // draw walls instead of passages
    let color = 'white';

    // Generate maze based on algorithm
    startTime = Date.now();
    if (algorithm === 'd') {
      genDFS(width, height, output, 0, 0);
    } else if (algorithm === 'k') {
      genKruskal(width, height, output);
    } else if (algorithm === 'p') {
      genPrim(width, height, output, 0, 0, 'heap');
    } else if (algorithm === 'pr') {
      genPrim(width, height, output, 0, 0, 'array');
    } else if (algorithm === 'e') {
      genEller(width, height, output);
    } else if (algorithm === 'r') {
      genRecursive(width, height, output);
    }
    genTime = Date.now() - startTime;

    // Convert maze to an array of coordinates
    if (algorithm === 'd' || algorithm === 'p' || algorithm === 'pr') {
      this.mazeCoords = output.cellsWithDirectionsToCoords();
    } else if (algorithm === 'k') {
      this.mazeCoords = output.adjecentWallsToCoords();
    } else if (algorithm === 'e') {
      this.mazeCoords = output;
    } else if (algorithm === 'r') {
      this.mazeCoords = output.wallsToCoords();
      invert = true;
      color = 'black';
    }

    // Output maze on screen
    if (this.genType == MazeUI.INSTANT) {
      startTime = Date.now();
      this.drawMaze(this.drawInstant, this.mazeCoords, color, true, invert);
      printTime = Date.now() - startTime;
    } else {
      this.drawMaze(this.drawStepByStep, this.mazeCoords, color, true, invert, this.stepSpeed);
      printTime = '-';
    }

    // Output stats
    this.printMazeInfo(width, height, genTime, printTime);
    console.log(`time: ${genTime} ms`);
  }

  /* Solve generated maze and time everything */
  solveMaze() {
    const width = this.width;
    const height = this.height;
    const algo = this.genAlgorithm;
    const coords = this.mazeCoords;
    let startTime, solveTime;

    // Construct a 2D matrix from mazeCoords array
    // in case of recursive divide we store walls instead of paths
    // therefore when constructing a 2D matrix we have to invert it
    const matrix = new Maze2D(width*2 - 1, height*2 - 1, (algo === 'r') ? false : true);

    if (algo === 'r') {
      for (let i = 0; i < coords.x.length; i++) {
        matrix.visitCell(coords.x[i], coords.y[i]);
      }
    } else {
      for (let i = 0; i < coords.x.length; i++) {
        matrix.unvisitCell(coords.x[i], coords.y[i]);
      }
    }

    startTime = Date.now();
    const solvedMaze = findSolution(matrix, 0, 0, width*2 - 2, height*2 - 2);
    solveTime = Date.now() - startTime;

    this.drawMaze(this.drawInstant, solvedMaze, 'red', false, false);
    this.printSolutionInfo(solvedMaze.x.length, solveTime);
  }
}

// Static properties
MazeUI.INSTANT = 0;
MazeUI.STEP_BY_STEP = 1;
MazeUI.STEP_SIZE = 3;