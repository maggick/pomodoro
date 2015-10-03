'use strict';

var ipc = require('ipc');

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function (e) {
  ipc.send('close-settings-window');
});

var configuration = require('../configuration');

var modifierCheckboxes = document.querySelectorAll('.global-shortcut');
var modifierTimers = document.querySelectorAll('.timer');

for (var i = 0; i < modifierCheckboxes.length; i++) {
  var shortcutKeys = configuration.readSettings('shortcutKeys');
  var modifierKey = modifierCheckboxes[i].attributes['data-modifier-key'].value;
  modifierCheckboxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1;

  modifierCheckboxes[i].addEventListener('click', function (e) {
    bindModifierCheckboxes(e);
  });
}

for (var i = 0; i < modifierTimers.length; i++) {
  var timers = configuration.readSettings('TimerDuration');
  var timerType = modifierTimers[i].attributes['id'].value;
  document.getElementById(timerType).value = timers[i];

  modifierTimers[i].addEventListener('click', function (e) {
    bindModifierTimers(e);
  });
  modifierTimers[i].addEventListener('keyup', function (e) {
    bindModifierTimers(e);
  });
}

function bindModifierCheckboxes(e) {
  var shortcutKeys = configuration.readSettings('shortcutKeys');
  var modifierKey = e.target.attributes['data-modifier-key'].value;

  if (shortcutKeys.indexOf(modifierKey) !== -1) {
    var shortcutKeyIndex = shortcutKeys.indexOf(modifierKey);
    shortcutKeys.splice(shortcutKeyIndex, 1);
  }
  else {
    shortcutKeys.push(modifierKey);
  }

  configuration.saveSettings('shortcutKeys', shortcutKeys);
  ipc.send('set-global-shortcuts');
}

function bindModifierTimers(e) {
  var timers = configuration.readSettings('TimerDuration');
  var modifierTimer = e.target.attributes['id'].value;

  var index =-1;
  switch(modifierTimer){
    case 'pomodoroDuration':
      index = 0;
      break;
    case 'shortBreakDuration':
      index = 1;
      break;
    case 'longBreakDuration':
      index = 2;
      break;
    default:
      console.log('what2?')
  }

  if (index !== -1) {
    timers[index] = document.getElementById(modifierTimer).value;
  }
  configuration.saveSettings('TimerDuration', timers);
}

// display the ms timer in a human readable format "min:sec"
// TODO make on utils.js file
function displayMs(time){
  var m = Math.floor((time/60000));
  var s = ((time % 60000)/1000).toFixed(0);
  if (s === 60){
    s = 0
  }
  return m + ":" + (s < 10 ? '0' : '') + s;
}
