// ax.js - javascript file associated with the display of ax on the screen
// the constructor of the class (object) Ax:
function Ax(gameHeight, gameWidth) {
  // initialize the instance properties:
  // drawing:
  this.startPosition = 1200;
  this.randomPosition = roundToFive(Math.floor(Math.random() * (gameHeight - 75)));
  // time through which the ax is created
  this.timerValue = 60000;
  // variables used to specify coordinates in a graphic file:
  this.srcX = 0;
  this.srcY = 0;
  // initial coordinates X and Y:
  this.drawX = this.startPosition;
  this.drawY = this.randomPosition;
  // image sizes:
  this.width = 120;
  this.height = 85;
  // speed:
  this.speed = 5;
  // adding game properties for access from the Ax methods:
  this.gameHeight = gameHeight;
  this.gameWidth = gameWidth;
  // when the variable isActive is false, the ax does not move.
  this.isActive = false;
  this.timer = this.timerValue;
  // image creation:
  this.axImg = new Image();
  this.axImg.src = 'images/ax.png';
  // invocation of startTimer and init function:
  this.startTimer();
  this.init();
}
// declare class methods:
// initialization function:
Ax.prototype.init = function() {
  this.axCanvas = document.getElementById('ax');
  this.ctxAxCanvas = this.axCanvas.getContext('2d');
  this.axCanvas.width = gameWidth;
  this.axCanvas.height = gameHeight;
};
// clear the rectangular area in coordinates 0, 0, gameWidth, gameHeight before moving the image in Ax.prototype.draw:
Ax.prototype.clearCtxAx = function() {
  this.ctxAxCanvas.clearRect(0, 0, this.gameWidth, this.gameHeight);
};
// drawing function
Ax.prototype.draw = function() {
  // delete previous frames (images) when updating:
  this.clearCtxAx();
  // drawing image onto the canvas:
  if (this.isActive) {
    this.ctxAxCanvas.drawImage(
      this.axImg,
      this.srcX,
      this.srcY,
      this.width,
      this.height, // image and parameters on the source image
      this.drawX,
      this.drawY,
      this.width,
      this.height
    ); // coordinates on the canvas
  }
};
// update function:
Ax.prototype.update = function(trees) {
  if (this.isActive) {
    this.drawX -= this.speed;
    player.keyboardControl = false;
    mouseControl = false;
    stopCreatingTrees();
    Tree.prototype.destroy();
    // implementation of overlapping ax with trees:
    // variable that is responsible for the overlap (in which we put the tree with which the overlap occurs):
    var overlapTree;
    // check all trees from the array:
    for (var i = 0; i < trees.length; i++) {
      var tree = trees[i];
      // obverlap cheking:
      if (
        this.drawY + this.height >= tree.drawY &&
        this.drawY <= tree.drawY + tree.height &&
        (this.drawX + this.width >= tree.drawX && this.drawX <= tree.drawX + tree.width)
      ) {
        // fix the fact of overlap and remember the tree with which ax was overlapped:
        overlapTree = tree;
      }
    }
    // window.bearOverlapTree = overlapTree; - for testing in a browser console
    if (overlapTree) {
      if (this.drawY + this.height < overlapTree.drawY + overlapTree.height) {
        this.axCanvas.style.zIndex = 0;
      } else if (this.drawY + this.height > overlapTree.drawY + overlapTree.height) {
        this.axCanvas.style.zIndex = 3;
      }
    } else {
      this.axCanvas.style.zIndex = 3;
    }
  }
};
// destroy function (use when necessary):
Ax.prototype.destroy = function() {
  this.axCanvas.remove();
};
// starttimer function:
Ax.prototype.startTimer = function startTimer() {
  // setinterval starts the function after 1000 ms continuously:
  var ax = this;
  this.setTimer = setInterval(function() {
    if (ax.timer > 0) {
      ax.timer -= 100;
    } else {
      ax.isActive = true;
    }
  }, 100);
};
// stoptimer function:
Ax.prototype.stopTimer = function stopTimer() {
  clearInterval(this.setTimer);
};
