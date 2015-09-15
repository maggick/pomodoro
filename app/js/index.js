'use strict';

var configuration = require('../configuration.js');
var timerDurations = configuration.readSettings('TimerDuration');

var pomodoroTimer = timerDurations[0];
var shortBreakTimer = timerDurations[1];
var longtBreakTimer = timerDurations[2];

var nodeTimers = require('node-timers');
var simple = nodeTimers.countdown({pollInterval: 1000, startTime: pomodoroTimer});

document.getElementById("timer").innerHTML = displayMs(pomodoroTimer);

var ipc = require('ipc');

var step = 0;

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
  ipc.send('close-main-window');
});

var settingsEl = document.querySelector('.settings');
settingsEl.addEventListener('click', function () {
  ipc.send('open-settings-window');
});

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
}

simple.on("poll", function (time) {
  var timer_text = document.querySelectorAll('.timer');
  document.getElementById("timer").innerHTML = displayMs(simple.time());
});

simple.on("done", function(time){
  console.log("done");
  step +=1;
  console.log(step%2);
  simple.reset();
  if (step % 2 == 0){
    simple.time(pomodoroTimer);
  }
  else{
    simple.time(shortBreakTimer);
  }
  document.getElementById("timer").innerHTML = displayMs(simple.time());
});

function displayMs(time){
  var m = Math.floor((time/60000));
  var s = ((time % 60000)/1000).toFixed(0);
  if (s === 60){
    s = 0
  }
  return m + ":" + (s < 10 ? '0' : '') + s;
}
