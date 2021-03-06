const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const {globalShortcut} = electron;

const {ipcMain} = electron;
const configuration = require('./configuration');

let settingsWindow = null;

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-settings-window', function () {
  if (settingsWindow) {
    return;
  }

  settingsWindow = new BrowserWindow({width: 200, height: 200, show: false});
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');
  settingsWindow.show();
});

ipcMain.on('close-settings-window', function () {
  if (settingsWindow) {
    settingsWindow.close();
  }
});

ipcMain.on('close-main-window', function () {
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
  mainWindow.loadURL('file://' + __dirname + '/app/index.html')

  // Open the devtools.
  mainWindow.openDevTools();

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
