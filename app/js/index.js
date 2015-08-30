'use strict';

var nodeTimers = require('node-timers'); //or
var simple = nodeTimers.timer({pollInterval: 1000, finishTime: 10000});
//var simple = nodeTimers.countdown({pollInterval: 1000, startTime: 1500000});

var actionButtons = document.querySelectorAll('.button-action');

for (var i = 0; i < actionButtons.length; i++) {
    var actionButton = actionButtons[i];
    var actionName = actionButton.attributes['data-action'].value;

    prepareButton(actionButton, actionName);
}

function prepareButton(buttonEl, actionName) {
    buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + actionName + '.png")';

  switch(actionName) {
      case 'start':
        buttonEl.addEventListener('click', function () {
          simple.start();
        });
        break;
      case 'pause':
        buttonEl.addEventListener('click', function () {
          simple.stop();
        });
          break;
      case 'stop':
        buttonEl.addEventListener('click', function () {
          simple.stop();
        });
          break;
      case 'reset':
        buttonEl.addEventListener('click', function () {
          simple.reset();
        });
          break;
      default:
          console.log('what?');
  }
    buttonEl.addEventListener('click', function () {
        console.log(simple.time());
    });
}

simple.on("poll", function (time) {
      console.log(time);
      var timer_text = document.querySelectorAll('.timer');
      //timer_text[0].querySelector('span') = 'url("img/icons/pause.png")';
});
