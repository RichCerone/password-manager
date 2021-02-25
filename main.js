const { app, BrowserWindow, ipcMain } = require('electron');

/* We'll register undefined variables here to 
 * be used for tracking our browser windows.
 */
let mainWin, signupWin;

/**
 * Creates the main window for the application.
 */
function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWin.loadFile('index.html');
}

/**
 * Creates a new window in the existing application.
 * @returns {BrowserWindow} The browser window created.
 */
function createWindow () {
  return new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
}

/**
 * Loads the content for the given window object
 * and window name.
 * 
 * @param {BrowserWindow} win The window object to load content to.
 * @param {string} winName The name of the window to load. 
 *                         Allowed values {
 *                            'index',
 *                            'signup'
 *                         }
 */
function loadWindow(win, winName) {
  switch (winName) {
    case 'index':
      win.loadFile('index.html');
    case "signup":
      win.loadFile('windows/signup/signup.html');
      break;
    default:
      throw "Window name does not exist.";
  }
}

// App start.
try {
  app.whenReady().then((createMainWindow));
}
catch (e) {
  app.quit(); 
}

// All windows closed listener.
try {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })
}
catch (e) {
  app.quit(); 
}

// Activate listner (creates main window).
try {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}
catch (e) {
  app.quit();
}

// Redirect signup.
try {
  ipcMain.on('redirectSignup', function(event, arg) {
    signupWin = createWindow();
    loadWindow(signupWin, 'signup');
    mainWin.close();
  });
}
catch (e) {
  app.quit();
}
