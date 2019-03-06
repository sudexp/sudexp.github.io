// bear.js - javascript file associated with the display of bear on the screen
// the constructor of the class (object) Bear:
function Bear(gameHeight, gameWidth, player) {
  // initialize the instance properties:
  // drawing:
  // variables used to specify coordinates in a graphic file:
  this.srcX = 0;
  this.srcY = 0;
  // initial coordinates X and Y:
  this.drawX = 0;
  this.drawY = Math.floor(Math.random() * gameHeight);
  // image sizes:
  this.width = 110;
  this.height = 80;
  // speed:
  this.speed = player.speed * 0.9;
  // adding game properties for access from the Bear methods:
  this.gameHeight = gameHeight;
  this.gameWidth = gameWidth;
  // images and switching between them:
  this.bearImg1 = new Image();
  this.bearImg1.src = 'images/bear1.png';
  this.bearImg2 = new Image();
  this.bearImg2.src = 'images/bear2.png';
  this.bearImgNum = 1; // value is either 1 or 2
  this.countBear = 1; // a counter that is incremented every time when the function draw invoking (loop calls draw)
  // invocation of init function:
  this.init();
}
// declare class methods:
// initialization function:
Bear.prototype.init = function() {
  this.bearCanvas = document.getElementById('bear');
  this.ctxBearCanvas = this.bearCanvas.getContext('2d');
  this.bearCanvas.width = this.gameWidth;
  this.bearCanvas.height = this.gameHeight;
};
// clear the rectangular area in coordinates 0, 0, gameWidth, gameHeight before moving the image in Bear.prototype.draw:
Bear.prototype.clearCtxBear = function() {
  this.ctxBearCanvas.clearRect(0, 0, this.gameWidth, this.gameHeight);
};
// drawing function
Bear.prototype.draw = function() {
  // delete previous frames (images) when updating:
  this.clearCtxBear();
  // before the question mark is condition
  // if this condition is true, insert the first value (after "?"), if its false, insert the second (after the":"):
  var bearImgCurrent = this.bearImgNum === 1 ? this.bearImg1 : this.bearImg2;
  // drawing image onto the canvas:
  this.ctxBearCanvas.drawImage(
    bearImgCurrent,
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
  if (this.countBear % 15 === 0) {
    // % 15 is like a switching speed
    this.bearImgNum = this.bearImgNum === 1 ? 2 : 1;
  }
  this.countBear++;
};
// update function:
Bear.prototype.update = function(player, trees) {
  var x = this.drawX + 1;
  this.drawX = player.drawX - 0.79 * this.width - player.health;
  if (this.drawY < player.drawY) {
    this.drawY += Math.floor(0.5 * this.speed);
  } else if (this.drawY > player.drawY) {
    this.drawY -= Math.ceil(0.5 * this.speed);
  } else {
  }
  // implementation of overlapping bear with trees:
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
      // fix the fact of overlap and remember the tree with which bear was overlapped:
      overlapTree = tree;
    }
  }
  // window.bearOverlapTree = overlapTree; - for testing in a browser console
  if (overlapTree) {
    if (overlapTree.collision) {
      this.bearCanvas.style.zIndex = 3;
    } else if (this.drawY + this.height < overlapTree.drawY + overlapTree.height) {
      this.bearCanvas.style.zIndex = 0;
    } else if (this.drawY + this.height > overlapTree.drawY + overlapTree.height) {
      this.bearCanvas.style.zIndex = 3;
    }
  } else {
    this.bearCanvas.style.zIndex = 3;
  }
  // bear movement if player won:
  if (player.win === true) {
    if (ax.drawY > 360 - 0.5 * ax.width) {
      this.drawX = x + 4;
      this.drawY -= 5;
    } else {
      this.drawX = x + 4;
      this.drawY += 5;
    }
  }
};
