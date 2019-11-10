$(document).ready(function($) {
  activateAnimation($);
  setupTheme($);
  setupProgresBar($);
  setupLightbox($);
});

// Подключение анимации
// https://impuls-web.ru/css-animaciya-poyavleniya-bez-plaginov/
// https://daneden.github.io/animate.css/
function activateAnimation($) {
  new WOW().init();
  $().addClass('wow animated');
}

// Подключение темы
// Лекции, Demo7
function setupTheme($) {
  // функция присваивает обработчик кнопке для смены темы
  var bodyElements = document.getElementsByTagName('body'); // достаем все элементы (массив!) с именем "body" и присваиваем переменной bodyElements. В результате этого bodyElements - это массив элементов body (один элемент).
  var body = bodyElements[0]; // создаем переменную body и присваиваем ей первый элемент из массива bodyElements (переменная body хранит в себе эмемент (тег) body)
  var nappi = document.getElementById('cube'); // создаем переменную nappi и присваем ей элемент с id=cube
  var nappialue = document.getElementById('change_styles'); // создаем переменную nappialue и присваем ей элемент с id=change_styles
  nappialue.onclick = function changeThemeClass() {
    // присваиваем хэндлеру (handler - обработчик) события click функцию, которая меняет тему
    if (body.className == 'dark') {
      // если значение класса у элемента body = dark
      body.className = 'light'; // присваиваем ему light
      nappi.style.left = '0'; // устанавливаем смещение элемента nappi (который является cube) от левого края родительского элемента равным 0
    } else {
      // иначе (если значение класса у элемента body НЕ = dark)
      body.className = 'dark'; // присваиваем ему dark
      nappi.style.left = '0.75em'; // устанавливаем смещение nappi.style.left равным 0.75em
    }
  };
}

// Тоже самое с использованием JQuery:
// function setupTheme($) {
//     var body = $('body')
//     var nappi = $('#cube')
//     var nappialue = $('#change_styles')
//     nappialue.click(function changeThemeClass() {
//         if (body.hasClass('dark')){
//             body.removeClass('dark');
//             body.addClass('light');
//             nappi.style({left: '0'});
//         } else {
//             body.removeClass('light');
//             body.addClass('dark');
//             nappi.style({left: '0.75em'});
//         }
//     })
// };

// Тоже самое, но короче:
// function setupTheme($) {
//     var body = $('body')
//     $('#change_styles').click(function changeThemeClass() {
//          body.toggleClass('dark').toggleClass('light')
//          if (body.hasClass('dark')){
//             $('#cube').style({left: '0'});
//          } else {
//             $('#cube').style({left: '0.75em'});
//          }
//     })
// };

// CSS: body.dark #cube{ left: 0.75em }
// CSS: body.light #cube{ left: 0 }

// Подключение прогресс-бара
// http://www.sitehere.ru/sozdanie-i-oformlenie-progress-bara-s-pomoshhyu-css3-i-html5
// http://htmlbook.ru/blog/sozdanie-i-stilizaciya-indikatora-vypolneniya-v-html5
// http://css-live.ru/tricks/krossbrauzernyj-progress-bar.html
function setupProgresBar($) {
  var started = false;
  window.onscroll = function() {
    if (!started && (document.documentElement.scrollTop >= 2900 || window.scrollY >= 2900)) {
      started = true;
      console.log('started!');
      startProgress();
    }
  };
  function startProgress() {
    var progressbars = $('.scalebar');
    var value = 0;
    var max = 100;
    var time = 40;

    var loading = function() {
      value += 1;
      for (var i = 0; i < progressbars.length; i++) {
        setProgress(progressbars[i], value);
      }
      if (value == max) {
        clearInterval(animate);
      }
    };
    var animate = setInterval(function() {
      loading();
    }, time);
  }
  function setProgress(el, value) {
    var $el = $(el);
    var end = $el.attr('data-end');
    if (value < end) {
      $el.val(value);
    }
  }
}

// Подключение темы
// Лекции, Demo6
function setupLightbox($) {
  lightbox.option({
    wrapAround: true, // Возможность использовать реверс при перемотке
    resizeDuration: 300 // Время, используемое для изменения размера изображения
  });
}
