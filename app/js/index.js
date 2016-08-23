'use strict';

// get the duration for all timer from configuration
var configuration = require('../configuration.js');
var timerDurations = configuration.readSettings('TimerDuration');
var pomodoroTimer = timerDurations[0];
var shortBreakTimer = timerDurations[1];
var longBreakTimer = timerDurations[2];

// create the timer with the pomodoro duration
var nodeTimers = require('node-timers');
var timer_pomodoro = nodeTimers.countdown({pollInterval: 1000, startTime: pomodoroTimer});
var timer_shortBreak = nodeTimers.countdown({pollInterval: 1000, startTime: shortBreakTimer});
var timer_longBreak = nodeTimers.countdown({pollInterval: 1000, startTime: longBreakTimer});

// display the pomodoro duration
document.getElementById("timer").innerHTML = displayMs(pomodoroTimer);

const {ipcRenderer} = require('electron');

// variable to know at which step we currently are (from 0 to 7)
// even step => pomodor
// odd => break (7 => long break)
var step = 0;

// let close the window with the close button
var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
  ipcRenderer.send('close-main-window');
});

// the settings button open the settings window
var settingsEl = document.querySelector('.settings');
settingsEl.addEventListener('click', function () {
  ipcRenderer.send('open-settings-window');
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
        if (step % 2 === 0){
          timer_pomodoro.reset();
          timer_pomodoro.start();
        }
        else{
          if (step === 7){
            timer_longBreak.reset();
            timer_longBreak.start();
          }
          else{
            timer_shortBreak.reset();
            timer_shortBreak.start();
          }
        }
      });
      break;
    case 'stop':
      buttonEl.addEventListener('click', function () {
        if (step % 2 === 0){
          timer_pomodoro.stop();
          timer_pomodoro.reset();
          document.getElementById("timer").innerHTML = displayMs(timer_pomodoro.time());
        }
        else{
          if (step === 7){
            timer_longBreak.stop();
            timer_longBreak.reset();
            document.getElementById("timer").innerHTML = displayMs(timer_longBreak.time());
          }
          else{
            timer_shortBreak.stop();
            timer_shortBreak.reset();
            document.getElementById("timer").innerHTML = displayMs(timer_shortBreak.time());
          }
        }
      });
      break;
    default:
      console.log('what?');
  }
}

// at each poll from the timer we display the remaining time
timer_pomodoro.on("poll", function (time) {
  document.getElementById("timer").innerHTML = displayMs(timer_pomodoro.time());
});

timer_pomodoro.on("done", function(time){
  console.log('done');
  step = (step + 1)%8;
  timer_pomodoro.stop();
  document.getElementById("timer").innerHTML = displayMs(shortBreakTimer);
  displayStep(step);
});

// at each poll from the timer we display the remaining time
timer_shortBreak.on("poll", function (time) {
  document.getElementById("timer").innerHTML = displayMs(timer_shortBreak.time());
});

timer_shortBreak.on("done", function(time){
  step = (step + 1)%8;
  timer_shortBreak.stop();
  document.getElementById("timer").innerHTML = displayMs(timer_pomodoro.time());
  displayStep(step);
});

// at each poll from the timer we display the remaining time
timer_longBreak.on("poll", function (time) {
  document.getElementById("timer").innerHTML = displayMs(timer_longBreak.time());
});

timer_longBreak.on("done", function(time){
  step = (step + 1)%8;
  timer_shortBreak.stop();
  document.getElementById("timer").innerHTML = displayMs(timer_pomodoro.time());
  displayStep(step);
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

function displayStep(step){
  switch (step){
    case 0:
      document.getElementById("step").innerHTML = "Pomodoro 1";
      break;
    case 1:
      document.getElementById("step").innerHTML = "Short break";
      break;
    case 2:
      document.getElementById("step").innerHTML = "Pomodoro 2";
      break;
    case 3:
      document.getElementById("step").innerHTML = "Short break";
      break;
    case 4:
      document.getElementById("step").innerHTML = "Pomodoro 3";
      break;
    case 5:
      document.getElementById("step").innerHTML = "Short break";
      break;
    case 6:
      document.getElementById("step").innerHTML = "Pomodoro 4";
      break;
    case 7:
      document.getElementById("step").innerHTML = "Long break";
      break;
    default:
      break;
  }
}
