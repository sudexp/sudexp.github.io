// info.js - javascript file associated with the display of statistical information on the screen
// the constructor of the class (object) Info:
function Info(gameHeight, gameWidth) {
  // initialize the instance properties:
  // drawing:
  // variables used to specify coordinates in a graphic file:
  this.srcX = 0;
  this.srcY = 0;
  // initial coordinates X and Y:
  this.drawX = 0;
  this.drawY = 0;
  // image sizes:
  this.width = 1280;
  this.height = 720;
  // speed
  this.speed = 0;
  // adding game properties for access from the Info methods:
  this.gameHeight = gameHeight;
  this.gameWidth = gameWidth;
  // image creation:
  this.infoImg = new Image();
  this.infoImg.src = 'images/info.png';
  // invocation of initialization function:
  this.init();
}

// declare class methods:
// initialization function:
Info.prototype.init = function() {
  this.infoCanvas = document.getElementById('info');
  this.ctxInfoCanvas = this.infoCanvas.getContext('2d');
  this.infoCanvas.width = gameWidth;
  this.infoCanvas.height = gameHeight;
};
// clear the rectangular area in coordinates 0, 0, gameWidth, gameHeight before moving the image in Info.prototype.draw:
Info.prototype.clearCtxInfo = function() {
  this.ctxInfoCanvas.clearRect(0, 0, this.gameWidth, this.gameHeight);
};
// drawing function
Info.prototype.draw = function() {
  // delete previous frames (images) when updating:
  this.clearCtxInfo();
  // drawing image onto the canvas:
  this.ctxInfoCanvas.drawImage(
    this.infoImg,
    this.srcX,
    this.srcY,
    this.width,
    this.height, // image and parameters on the source image
    this.drawX,
    this.drawY,
    this.width,
    this.height
  ); // coordinates on the canvas
};
// update function:
Info.prototype.update = function() {
  this.drawX -= this.speed;
};
