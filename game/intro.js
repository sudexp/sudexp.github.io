// intro.js - javascript file related to the loading of animation and menu before starting the game
// script execution after page load
window.onload = function() {
  var video = document.getElementById('animation');
  var skip = document.getElementById('skip_button');
  var wrap = document.getElementById('wrap');
  // ability to cancel viewing video and go to function "video.onended"
  skip.addEventListener(
    'click',
    function() {
      video.onended();
    },
    false
  );
  // go to the game menu
  video.onended = function() {
    wrap.remove();
    document.getElementById('background_intro').style.display = 'block';
  };
};
// scrolling menu to the left
function back(number) {
  $('#instruction-' + (number + 1)).hide();
  $('#instruction-' + number).show();
}
// scrolling menu to the right
function next(number) {
  $('#instruction-' + (number - 1)).hide();
  $('#instruction-' + number).show();
}
// starting function "init" in "game.js" - start of the game
function start() {
  $('#background_intro').hide();
  $('#intro').hide();
  init();
}
