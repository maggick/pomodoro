var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var globalShortcut = require('global-shortcut');
var ipc = require('ipc');
var configuration = require('./configuration');
var settingsWindow = null;

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipc.on('open-settings-window', function () {
  if (settingsWindow) {
    return;
  }

  settingsWindow = new BrowserWindow({
    frame: false,
    height: 200,
    resizable: false,
    width: 200
  });

  settingsWindow.loadUrl('file://' + __dirname + '/app/settings.html');

  settingsWindow.on('closed', function () {
    settingsWindow = null;
  });
});

ipc.on('close-settings-window', function () {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

ipc.on('close-main-window', function () {
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  if (!configuration.readSettings('shortcutKeys')) {
    configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
  }
  if (!configuration.readSettings('TimerDuration')) {
    configuration.saveSettings('TimerDuration', [1500000, 300000, 900000]);
  }
  setConfiguration();

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 300, height: 300});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  // Open the devtools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

function setConfiguration(){
  setGlobalShortcuts();
  //setDuration();
}


function setGlobalShortcuts() {
  globalShortcut.unregisterAll();

  var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
  var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

  globalShortcut.register(shortcutPrefix + '1', function () {
    mainWindow.webContents.send('global-shortcut', 0);
  });
  globalShortcut.register(shortcutPrefix + '2', function () {
    mainWindow.webContents.send('global-shortcut', 1);
  });
}
