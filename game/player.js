// player.js - javascript file associated with the display of player (folke) on the screen
// the constructor of the class (object) Player:
function Player(gameHeight, gameWidth) {
  // this --> Player
  // initialize the instance properties:
  // variable responsible for the health of player (distance to the bear):
  this.health = 100;
  // variable responsible for ax capture (winning in the game):
  this.win = false;
  // drawing part:
  // variables used to specify coordinates in a graphic file:
  this.srcX = 0;
  this.srcY = 0;
  // initial coordinates X and Y:
  this.drawX = 250;
  this.drawY = roundToFive(Math.floor(Math.random() * (gameHeight - 100)));
  // image sizes:
  this.width = 73;
  this.height = 75;
  // speed (the part associated with update):
  this.speed = 5;
  // for control from the keyboard - the variables responsible for moving the object
  this.isUp = false; // it's important to set their values to false, since the object should not move without affecting it
  this.isDown = false;
  this.isRight = false;
  this.isLeft = false;
  // adding game properties for access from the Player methods:
  this.gameHeight = gameHeight;
  this.gameWidth = gameWidth;
  // images and switching between them:
  this.playerImg1 = new Image();
  this.playerImg1.src = 'images/folke1.png';
  this.playerImg2 = new Image();
  this.playerImg2.src = 'images/folke2.png';
  this.playerImgNum = 1; // value is either 1 or 2
  this.countPlayer = 1; // a counter that is incremented every time when the function draw invoking (loop calls draw)
  // invocation of init function:
  this.init();
}
// declare class methods:
// initialization function:
Player.prototype.init = function() {
  this.playerCanvas = document.getElementById('player'); // the variable responsible for canvas (must have a tag)
  this.ctxPlayerCanvas = this.playerCanvas.getContext('2d'); // method returns a drawing context on the canvas
  this.playerCanvas.width = this.gameWidth;
  this.playerCanvas.height = this.gameHeight;
};
// clear the rectangular area in coordinates 0, 0, gameWidth, gameHeight before moving the image in Player.prototype.draw:
Player.prototype.clearCtxPlayer = function() {
  this.ctxPlayerCanvas.clearRect(0, 0, this.gameWidth, this.gameHeight);
};
// drawing function (this function is called every time from loop):
Player.prototype.draw = function() {
  // delete previous frames (images) when updating:
  this.clearCtxPlayer();
  // before the question mark is condition
  // if this condition is true, insert the first value (after "?"), if its false, insert the second (after the":"):
  var playerImgCurrent = this.playerImgNum === 1 ? this.playerImg1 : this.playerImg2;
  // drawing image onto the canvas:
  this.ctxPlayerCanvas.drawImage(
    playerImgCurrent,
    this.srcX,
    this.srcY,
    this.width,
    this.height,
    this.drawX,
    this.drawY,
    this.width,
    this.height
  );
  // switch between 1 and 2 (if 1 then 2, if not 1 then 1)
  if (this.countPlayer % 10 === 0) {
    // % 10 is like a switching speed
    this.playerImgNum = this.playerImgNum === 1 ? 2 : 1;
  }
  this.countPlayer++;
};
// update function of moving player-object on the scene (interacts with the coordinates of the object on the scene drawX and drawY)
Player.prototype.update = function(ax, trees, audio) {
  this.chooseDirection();
  if (this.drawX < 0) {
    // if the X coordinate of the object is less than zero (the object is outside the canvas on the left side)
    this.drawX = 0; // set this coordinate to zero (the object after that does not move to the left for the canvas)
  }
  // similarly to the above for other coordinates:
  if (this.drawX > this.gameWidth - this.width) {
    this.drawX = this.gameWidth - this.width; // must be subtracted, since the origin of the object in the left upper point
  }
  if (this.drawY < 0) {
    this.drawY = 0;
  }
  if (this.drawY > this.gameHeight - this.height) {
    this.drawY = this.gameHeight - this.height;
  }
  // limit the object to move forward:
  if (this.drawX > this.gameWidth - this.width - 900 && mouseControl === false) {
    this.drawX = this.gameWidth - this.width - 900;
  }
  // limit the object to move back:
  if (this.drawX < this.gameWidth - this.width - 1000 && mouseControl === false) {
    this.drawX = this.gameWidth - this.width - 1000;
  }
  // limit the object to move up:
  if (this.drawY < 50 && mouseControl === false) {
    this.drawY = 50;
  }
  // implementation of collision and overlapping player with trees:
  // variable that is responsible for the overlap (in which we put the tree with which the overlap occurs):
  var overlapTree;
  // it is necessary to go through the elements of the array in order to be able to collide with all objects, and not with one
  for (var i = 0; i < trees.length; i++) {
    var tree = trees[i];
    // check only the trees we have not encountered yet:
    if (tree.collision === false) {
      if (
        this.drawY + this.height >= tree.drawY + 105 &&
        this.drawY + 45 <= tree.drawY + tree.height &&
        (this.drawX + this.width >= tree.drawX && this.drawX <= tree.drawX + tree.width)
      ) {
        // display of a collision random messages:
        showRandomMessage();
        // assign a flag to collisions:
        tree.collision = true;
        // reduce the health of the player (distance to bear)
        this.health -= 10;
      }
    }
    // implementation of overlapping player with trees:
    if (
      ((this.drawY < tree.drawY + tree.height && this.drawY + 45 > tree.drawY + tree.height) || // 45px - distance to the shadow of player
        (this.drawY + this.height > tree.drawY && this.drawY + this.height < tree.drawY + 105)) && // 105px - distance to the shadow of tree
      (this.drawX + this.width >= tree.drawX && this.drawX <= tree.drawX + tree.width)
    ) {
      // fix the fact of overlap and remember the tree with which bear was overlapped:
      overlapTree = tree;
    }
  }
  if (overlapTree) {
    if (overlapTree.collision) {
      Tree.treeCanvas.style.zIndex = 1;
    } else if (this.drawY + this.height < overlapTree.drawY + overlapTree.height) {
      Tree.treeCanvas.style.zIndex = 3;
    } else if (this.drawY + this.height > overlapTree.drawY + overlapTree.height) {
      Tree.treeCanvas.style.zIndex = 1;
    }
  } else {
    Tree.treeCanvas.style.zIndex = 1;
  }
  // implementation of collision player with trees: (winning in the game):
  if (ax.drawX + ax.width <= 1150) {
    if (this.drawY < ax.drawY) {
      this.drawY += this.speed;
    } else if (this.drawY > ax.drawY) {
      this.drawY -= this.speed;
    } else {
    }
  }
  if (
    this.drawX + this.width >= ax.drawX && // player touches the ax from left
    this.drawY + this.height >= ax.drawY + 45 && // player touches the ax from above
    this.drawX <= ax.drawX + ax.width && // player touches the ax from right
    this.drawY + 45 <= ax.drawY + ax.height
  ) {
    // player touches the ax from below
    this.win = true;
  }
};
// choose direction function:
Player.prototype.chooseDirection = function() {
  if (this.isUp) {
    this.drawY -= this.speed; // when moving up, Y coordinate decreases
  }
  if (this.isDown) {
    this.drawY += this.speed; // when moving up, Y coordinate increases
  }
  if (this.isRight) {
    this.drawX += this.speed; // when moving right, X coordinate increases
  }
  if (this.isLeft) {
    this.drawX -= this.speed; // when moving left, X coordinate decreases
  }
};
// random mesage function (show message when is collision):
function showRandomMessage() {
  var words = ['Boom!', 'Be carefull!', "Don't hurry!", 'Pay attention!'];
  var randomWord = Math.floor(Math.random() * words.length);
  // display random message on the screen:
  document.getElementById('gameName').innerHTML = words[randomWord];
  // change (remove) message to empty after 1 second:
  setTimeout(function() {
    document.getElementById('gameName').innerHTML = '';
  }, 1000);
}
