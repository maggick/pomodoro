'use strict';

// get the duration for all timer from configuration
var configuration = require('../configuration.js');
var timerDurations = configuration.readSettings('TimerDuration');
var pomodoroTimer = timerDurations[0];
var shortBreakTimer = timerDurations[1];
var longtBreakTimer = timerDurations[2];

// create the timer with the pomodoro duration
var nodeTimers = require('node-timers');
var simple = nodeTimers.countdown({pollInterval: 1000, startTime: pomodoroTimer});

// display the pomodoro duration
document.getElementById("timer").innerHTML = displayMs(pomodoroTimer);

var ipc = require('ipc');

// variable to know at which step we currently are (from 0 to 7)
var step = 0;

// let close the window with the close button
var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
  ipc.send('close-main-window');
});

// the settings button open the settings window
var settingsEl = document.querySelector('.settings');
settingsEl.addEventListener('click', function () {
  ipc.send('open-settings-window');
});

// set all action button
var actionButtons = document.querySelectorAll('.button-action');
for (var i = 0; i < actionButtons.length; i++) {
  var actionButton = actionButtons[i];
  var actionName = actionButton.attributes['data-action'].value;
  prepareButton(actionButton, actionName);
}

// prepare each button
function prepareButton(buttonEl, actionName) {
  buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + actionName + '.png")';

  switch(actionName) {
    case 'start':
      buttonEl.addEventListener('click', function () {
        simple.start();
      });
      break;
    case 'stop':
      buttonEl.addEventListener('click', function () {
        simple.stop();
        simple.reset();
        document.getElementById("timer").innerHTML = displayMs(simple.time());
      });
      break;
    default:
      console.log('what?');
  }
}

// at each poll from the timer we display the remaining time
simple.on("poll", function (time) {
  document.getElementById("timer").innerHTML = displayMs(simple.time());
});

// at the end of one timer we start a pomodoro or a pause depending of the step #TODO #FIXME
simple.on("done", function(time){
  step = (step + 1)%8;
  simple.reset();
  if (step % 2 == 0){
    simple.time(pomodoroTimer);
  }
  else{
    simple.time(shortBreakTimer);
  }
  document.getElementById("timer").innerHTML = displayMs(simple.time());
  document.getElementById("step").innerHTML = step+"/8";
});

// display the ms timer in a human readable format "min:sec"
function displayMs(time){
  var m = Math.floor((time/60000));
  var s = ((time % 60000)/1000).toFixed(0);
  if (s === 60){
    s = 0
  }
  return m + ":" + (s < 10 ? '0' : '') + s;
}
