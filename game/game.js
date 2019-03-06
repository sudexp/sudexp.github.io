// game.js - main game javascript file
// start the game (function init) after the page is loaded:
// window.onload = init;

// variable of type boolean (play or not ?!)
var isPlaying;
// variables for map:
var map;
var ctxMap; // variable through which we interact with the game's canvas:
// variables for canvas:
var statsCanvas;
var ctxStatsCanvas;
// game sizes:
var gameWidth = 1280;
var gameHeight = 720;
// variables responsible for the background:
var background1 = new Image();
var background2 = new Image();
// pathes to this image:
background1.src = 'images/background.png';
background2.src = 'images/background.png';
// variables for pause:
var pauseButton;
// variables for objects:
var player;
var bear;
var ax;
var info;
// initialization of the background moving variables on the X axis:
var map1X = 0;
var map2X = gameWidth;
var speed = 5;
// variables for creating tree objects:
var treeMaxCount = 30;
var treeCreateTime = 500;
// variables to use the mouse:
var mouseX;
var mouseY;
var mouseControl = false; // by default, mouse control is disabled
var keyboardControl = true;
// to capture the moment when user wins to run loop just one time
var winHappened = false;
// variable to control audio:
var audio;
// API for drawing / optimizing smoother browsing animation (asks the browser to schedule repainting on the next animation frame):
var requestAnimationFrame =
  window.requestAnimationFrame || // unknown
  window.webkitRequestAnimationFrame || // chrome, safari, yandex...
  window.mozRequestAnimationFrame || // mozilla
  window.oRequestAnimationFrame || // opera
  window.msRequestAnimationFrame; // IE

// function for initializing variables / invocation of functions
function init() {
  // console.log('init');
  // get the canvas object using the document.getElementById method:
  map = document.getElementById('map');
  // getContext() method generates a two-dimensional drawing context that will be associated with the specified canvas:
  ctxMap = map.getContext('2d');
  statsCanvas = document.getElementById('stats');
  ctxStatsCanvas = statsCanvas.getContext('2d');
  // sizes:
  map.width = gameWidth;
  map.height = gameHeight;
  statsCanvas.width = gameWidth;
  statsCanvas.height = gameHeight;
  // set the style for displaying using the embedded variable fillStyle:
  ctxStatsCanvas.fillStyle = '#3d3d3d';
  // set the font of the inscriptions with the built-in variable font:
  ctxStatsCanvas.font = 'bold 28px Norse Regular';
  // initialize (create) objects:
  player = new Player(gameHeight, gameWidth);
  bear = new Bear(gameHeight, gameWidth, player);
  ax = new Ax(gameHeight, gameWidth);
  info = new Info(gameHeight, gameWidth);
  // all trees use one canvas, so initialize only it (not for each tree individually):
  Tree.init(gameHeight, gameWidth, treeMaxCount, treeCreateTime);
  // hide the mouse cursor:
  // document.getElementById('stats').style.cursor = 'none';
  // invocation of start loop:
  startLoop();
  // attach event handlers to the document for control from the keyboard and mouse:
  document.addEventListener('keydown', checkKeyDown, false);
  document.addEventListener('keyup', checkKeyUp, false);
  document.addEventListener('mousemove', mouseMove, false);
  document.addEventListener('click', mouseClick, false);
  // implementation of audio playback:
  audio = new Audio('../../track.mp3');
  audio.loop = true;
  audio.play();
  // implementation of pause in the game:
  pauseButton = document.getElementById('stats');
  pauseButton.addEventListener('click', pauseGame, false);
  addEventListener('keydown', function(event) {
    if (event.keyCode === 32) pauseGame();
  });
  // implementation of exit the game:
  addEventListener('keydown', function(event) {
    if (event.keyCode === 80) loseGame();
  });
  // ability to switch on mouse control from the game:
  addEventListener('keydown', function(event) {
    if (event.keyCode === 77) mouseControl = true;
    // document.getElementById('stats').style.cursor = 'pointer';
  });
  document.getElementById('sound').style.display = 'block';
  document.getElementById('exit').style.display = 'block';
}
// function loop - calls itself recursively, requesting the browser whenever it is ready for animation (requestAnimationFrame):
var loopTimeout;
// var fps = 60; // controlling the frame rate
function loop() {
  if (isPlaying) {
    draw();
    update();
    // plans the loop function for the next AnimationFrame
    // setTimeout(function() {
    loopTimeout = requestAnimationFrame(loop);
    // }, 1000 / fps);
  }
}
// function start loop:
function startLoop() {
  isPlaying = true;
  // run the loop for the first time:
  loop();
  startCreatingTrees(); // may to call it in init
}
// function stop loop:
function stopLoop() {
  isPlaying = false;
  // should to cancel the scheduled requestAnimationFrame:
  cancelAnimationFrame(loopTimeout);
}
// drawing function:
function draw() {
  player.draw();
  bear.draw();
  ax.draw();
  info.draw();
  // clear the context with all trees (erase them), before drawing them in a new position:
  Tree.clearCtx();
  for (var i = 0; i < Tree.trees.length; i++) {
    // for each element of the trees[] array, create a new Tree object:
    Tree.trees[i].draw(stopLoop, startLoop);
  }
}
// update function:
function update() {
  // console.log('loop');
  // debugger
  moveBackground();
  drawBackground();
  updateStats();
  ax.update(Tree.trees);
  // warning message 5 seconds before the speed increase:
  if (ax.timer % 35100 === 0 && ax.timer > 0) {
    document.getElementById('gameName').innerHTML = 'Attention! Speed will increase after five seconds.';
    setTimeout(function() {
      document.getElementById('gameName').innerHTML = '';
    }, 5000);
  }
  // speed increase:
  if (ax.timer % 30100 === 0) {
    speed = 7;
    Tree.prototype.speed = 7;
    ax.speed = 7;
  }
  player.update(ax, Tree.trees, audio);
  bear.update(player, Tree.trees);
  info.update();
  // similarly to draw ():
  for (var i = 0; i < Tree.trees.length; i++) {
    Tree.trees[i].update();
  }
  if (player.health <= 0) {
    updateStats();
    stopLoop();
    stopCreatingTrees();
    doPause1s();
  }
  if (player.win) {
    speed = 0;
    ax.speed = 0;
    document.getElementById('gameName').innerHTML = '';
    if (!winHappened) {
      player.speed = 0;
      player.width = 67;
      player.height = 100;
      player.playerImg1.src = 'images/folke3.png';
      player.playerImg2.src = 'images/folke3.png';
      ax.axImg.src = 'images/stump.png';
      doPause3s();
      winHappened = true;
    }
  }
}
// background drawing:
function drawBackground() {
  // erase the previous frame that was the previous image:
  ctxMap.clearRect(0, 0, gameWidth, gameHeight);
  ctxMap.drawImage(
    background1,
    0,
    0,
    gameWidth,
    gameHeight, // the size of the picture
    map1X,
    0,
    gameWidth,
    gameHeight
  ); // size on the screen
  ctxMap.drawImage(background2, 0, 0, gameWidth, gameHeight, map2X, 0, gameWidth, gameHeight);
}
// background moving:
function moveBackground() {
  map1X -= speed;
  map2X -= speed;
  // background when passing the left border of the canvas moves to the right side of the canvas and again moves to the left:
  if (map1X + gameWidth <= 0) {
    map1X = gameWidth + (map1X + gameWidth);
  }
  // similarly to the first:
  if (map2X + gameWidth <= 0) {
    map2X = gameWidth + (map2X + gameWidth);
  }
}
// function of updating information (statistics):
function updateStats() {
  ctxStatsCanvas.clearRect(0, 0, gameWidth, gameHeight);
  ctxStatsCanvas.fillText(player.health / 10 + 'm', 575, 50);
  ctxStatsCanvas.fillText(ax.timer / 100 + 'm', 675, 50);
}
// function responsible for pressing a key of the keyboard:
function checkKeyDown(e) {
  // the event e is responsible for: what key was pressed
  // variable of support for old browsers:
  var keyID = e.keyCode || e.which;
  // convert the value into strings to facilitate data manipulation:
  var keyChar = String.fromCharCode(keyID);
  if (keyboardControl) {
    if (keyChar == 'W') {
      player.isUp = true;
      // function sets the value of the pressed key to the state it was in before:
      e.preventDefault();
    }
    if (keyChar == 'S') {
      player.isDown = true;
      e.preventDefault();
    }
    if (keyChar == 'D') {
      player.isRight = true;
      e.preventDefault();
    }
    if (keyChar == 'A') {
      player.isLeft = true;
      e.preventDefault();
    }
  } else {
  }
}
// the function responsible for releasing the key of the keyboard:
function checkKeyUp(e) {
  var keyID = e.keyCode || e.which;
  var keyChar = String.fromCharCode(keyID);
  if (keyboardControl) {
    if (keyChar == 'W') {
      player.isUp = false;
      e.preventDefault();
    }
    if (keyChar == 'S') {
      player.isDown = false;
      e.preventDefault();
    }
    if (keyChar == 'D') {
      player.isRight = false;
      e.preventDefault();
    }
    if (keyChar == 'A') {
      player.isLeft = false;
      e.preventDefault();
    }
  } else {
  }
}
// mouse control function:
function mouseMove(e) {
  // here is passed the event, which will be responsible for the movement of the mouse
  if (!mouseControl) return;
  // each time update the X coordinate, which will be counted along the X axis from the entire web page (canvas does not have certain coordinates), even when the mouse is outside the canvas:
  mouseX = e.pageX - map.offsetLeft;
  // at the same time it is necessary to compensate the distance to which the canvas is shifted from the upper-left corner of the web-page:
  mouseY = e.pageY - map.offsetTop;
  // display the mouse coordinates in #gameName:
  document.getElementById('gameName').innerHTML = 'X: ' + mouseX + ' Y: ' + mouseY;
  // player constantly follows the cursor:
  player.drawX = roundToFive(mouseX - player.width / 2);
  player.drawY = roundToFive(mouseY - player.height / 2);
}
// mouse click function:
function mouseClick(e) {
  // here in the parameters is passed the event, which will be responsible for the click of the mouse
  if (!mouseControl) return;
  // display the mouse click (it's a pause) in #gameName:
  document.getElementById('gameName').innerHTML = 'Pause';
}
// function to implement a pause in the game:
var pause = false;
function pauseGame() {
  if (pause === false) {
    pause = true;
    ax.stopTimer();
    stopLoop();
    audio.pause();
  } else {
    pause = false;
    ax.startTimer();
    startLoop();
    audio.play();
  }
}
// function to implement a pause before invocation of loseGame function:
function doPause1s() {
  setTimeout(function() {
    loseGame();
  }, 1000);
}
// function to implement a pause before invocation of winGame function:
function doPause3s() {
  setTimeout(function() {
    stopLoop();
    winGame();
  }, 3000);
}
// loseGame function:
function loseGame() {
  $('#map').hide();
  $('#trees').hide();
  $('#ax').hide();
  $('#player').hide();
  $('#bear').hide();
  $('#info').hide();
  $('#stats').hide();
  $('.wrap').hide();
  $('#losing').show();
  $('#losing')
    .get(0)
    .play();
}
// winGame function:
function winGame() {
  $('#map').hide();
  $('#trees').hide();
  $('#ax').hide();
  $('#player').hide();
  $('#bear').hide();
  $('#info').hide();
  $('#stats').hide();
  $('.wrap').hide();
  $('#winning').show();
  $('#winning')
    .get(0)
    .play();
  // console.log("Testi!");
}
// rounding function up to 5:
function roundToFive(a) {
  var b = a % 5;
  b && (a = a - b + 5);
  return a;
}
// exit the game
function exitGame() {
  window.location.reload();
}
// change sound and sound icons:
function switchSound() {
  var wrapElement = document.getElementById('wrapSE');
  var wrap = wrapElement;
  if (wrap.className === 'on') {
    audio.pause();
    wrap.className = 'off';
  } else {
    audio.play();
    wrap.className = 'on';
  }
}
