// trees.js - javascript file associated with the display of trees on the screen
// Image creation:
var treeImg1 = new Image();
treeImg1.src = 'images/tree1.png';
var treeImg2 = new Image();
treeImg2.src = 'images/tree2.png';
var treeImg3 = new Image();
treeImg3.src = 'images/tree3.png';
// the constructor of the class (object) Tree:
function Tree(gameHeight, gameWidth) {
  // initialize the instance properties:
  // drawing part:
  // variables used to specify coordinates in a graphic file:
  this.srcX = 0;
  this.srcY = 0;
  // initial coordinates X and Y:
  this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth; // appearance of the object behind the right side of canvas (X axis) at a random distance
  this.drawY = Math.floor(Math.random() * gameHeight); // appearance of the object along the Y axis at a random position
  // image sizes:
  this.width = 94;
  this.height = 148;
  // flag-variable of collision (each tree has its own):
  this.collision = false;
  // flag-variable which will be used to pause in a collision:
  this.usedForPause = false;
  // зosition correction if the tree appears below the screen:
  if (this.drawY + this.height > gameHeight) {
    this.drawY = gameHeight - this.height;
  }
  //X-coordinate overlap check function:
  this.overlapXTrees();
}
// functions that we attach to the Tree class itself will be used for all trees (not for a particular tree).
// initialization function:
Tree.init = function(gameHeight, gameWidth, maxCount, createTime) {
  // assign game configurations:
  Tree.gameHeight = gameHeight;
  Tree.gameWidth = gameWidth;
  // here will store the created trees:
  Tree.trees = [];
  Tree.maxCount = maxCount;
  Tree.createTime = createTime;
  // return a drawing context on the canvas:
  Tree.treeCanvas = document.getElementById('trees');
  Tree.ctxTreeCanvas = Tree.treeCanvas.getContext('2d');
  // define canvas sizes:
  Tree.treeCanvas.width = gameWidth;
  Tree.treeCanvas.height = gameHeight;
};
// clear the rectangular area in coordinates 0, 0, gameWidth, gameHeight before moving the image in Tree.prototype.draw:
Tree.clearCtx = function() {
  Tree.ctxTreeCanvas.clearRect(0, 0, Tree.gameWidth, Tree.gameHeight);
};
// declare class methods:
// the function to create tree objects (not initialized in init () - is called during the game loop continues):
function createTree(count) {
  // to have the number of objects not more than "MaxCount":
  var newCount = count - Tree.trees.length;
  for (var i = 0; i < newCount; i++) {
    // every time we call this function, we add new elements to the end of the trees array (and keep all existing ones):
    var newTree = new Tree(Tree.gameHeight, Tree.gameWidth);
    // for each element of the trees [] array, a new Tree object create:
    Tree.trees.push(newTree);
  }
}
// function that starts creating trees:
var treeCreationInterval;
function startCreatingTrees() {
  // is called to remove all previous objects from the scene every 1 c (createTime):
  stopCreatingTrees(); // otherwise too many objects will be created -> affects performance
  // initialize variable with the built-in function js setInterval:
  treeCreationInterval = setInterval(function() {
    createTree(Tree.maxCount);
  }, Tree.createTime);
}
// this function removes all objects on the canvas (clear the interval):
function stopCreatingTrees() {
  clearInterval(treeCreationInterval);
}
// drawing function:
Tree.prototype.draw = function(stopLoop, startLoop) {
  // if there is no collision, draw an ordinary tree:
  if (this.collision === false) {
    Tree.ctxTreeCanvas.drawImage(
      treeImg1,
      this.srcX,
      this.srcY,
      this.width,
      this.height,
      this.drawX,
      this.drawY,
      this.width,
      this.height
    );
  } else {
    // if there is no collision:
    if (!this.usedForPause) {
      // draw a still standing, but red tree:
      Tree.ctxTreeCanvas.drawImage(
        treeImg3,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        this.drawX,
        this.drawY,
        this.width,
        this.height
      );
      // to do pause:
      stopLoop();
      setTimeout(function() {
        startLoop();
      }, 300);
      // fix the flag that we have a pause:
      this.usedForPause = true;
    } else {
      // draw the fallen tree:
      Tree.ctxTreeCanvas.drawImage(
        treeImg2,
        this.srcX,
        this.srcY,
        this.width,
        this.height,
        this.drawX,
        this.drawY,
        this.width,
        this.height
      );
    }
  }
};
// update function:
Tree.prototype.update = function() {
  this.drawX -= this.speed;
  if (this.drawX + this.width < 0) {
    // if tree went outside the canvas on the left side, remove it from the array:
    this.destroy();
  }
};

// speed (the same speed for all trees):
Tree.prototype.speed = 5;

// function that will remove the object from array:
Tree.prototype.destroy = function() {
  // splice is a built-in js method (function) that allows you to delete any variable from an array:
  Tree.trees.splice(Tree.trees.indexOf(this), 1);
  // the first splice parameter is the position from which the delete begins // second parameter - the number of elements to remove from the array // the construction with indexOf (this) allows you to delete exactly the object that leaves the scene
  // console.log(`- destroying ${trees.indexOf(this)} of ${trees.length}`) - check it
};
// sort method Array.prototype.sort:
Tree.prototype.overlapXTrees = function() {
  // sort trees by X position:
  var sortedX = Tree.trees.sort(function(a, b) {
    return a.drawX - b.drawX;
  });
  // if the current tree is overlapped on any existing tree, move it to the right:
  for (var i = 0; i < sortedX.length; i++) {
    if (
      (this.drawX >= sortedX[i].drawX && this.drawX <= sortedX[i].drawX + this.width) ||
      (this.drawX <= sortedX[i].drawX && this.drawX >= sortedX[i].drawX - this.width)
    ) {
      this.drawX = sortedX[i].drawX + 0.6 * this.width;
    }
  }
};
