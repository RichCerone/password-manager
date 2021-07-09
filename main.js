const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')

const { SqliteService } = require('./modules/sqlite/SqliteService');

const argon2 = require('argon2');
const { Argon2Service } = require('./modules/hashing/Argon2Service');

// TODO: Get params from a JSON file.
const argon2Service = new Argon2Service(argon2.argon2id, 2 ** 16, 50);
// TODO: Get path from a JSON file.
const dbService = new SqliteService('./db/password-manager.db');

/* We'll register undefined variables here to 
 * be used for tracking our browser windows.
 */
let mainWin, signupWin, passwordsWin;

/**
 * Creates the main window for the application.
 */
function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
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
      preload: path.join(__dirname, 'preload.js')
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
 *                            'signup',
 *                            'passwords'
 *                         }
 */
function loadWindow(win, winName) {
  switch (winName) {
    case 'index':
      win.loadFile('index.html');
      break;
    case 'signup':
      win.loadFile('windows/signup/signup.html');
      break;
    case 'passwords':
      win.loadFile('windows/passwords/passwords.html');
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

// Redirect to login from signup.
try {
  ipcMain.on('redirectToIndexFromSignup', function(event, arg) {
    mainWin = createWindow();
    loadWindow(mainWin, 'index');
    signupWin.close();
  });
}
catch (e) {
  app.quit();
}

// Redirect to passwords from from login.
try {
  ipcMain.on('redirectPasswords', function(event, arg) {
    passwordsWin = createWindow();
    loadWindow(passwordsWin, 'passwords');
    mainWin.close();
  });
}
catch (e) {
  app.quit();
}

// Handle user signup.
try {
  ipcMain.on('signupUser', async function(event, arg) {
    const user = arg.user;
    const hash = arg.hash;

    // Create user in database.
    await dbService.open();

    const stmt = 'INSERT INTO Users VALUES (?, ?)';

    try
    {
      const result = dbService.execute(stmt, [user, hash]);
      // Let renderer know that the user was created.
      event.reply('userCreated', result);
    }
    catch (e)
    {
      event.reply('userCreated', false);
      return;
    }
  });
}
catch (e) {
  app.quit();
}

// Handle login verification.
try {
  ipcMain.on('verifyLogin', async function (event, arg) {
    const user = arg.user;
    const hash = arg.hash;

    // Get user password in database.
    await dbService.open();

    const stmt = 'SELECT passwordHash FROM Users WHERE userName=(?)';

    try {
      const result = dbService.execute(stmt, [user], true, true);
      if (result.result.passwordHash === undefined) {
        event.reply('loginVerified', 'The username could not be found.');
      }
      else if (await argon2Service.verify(result.result.passwordHash, hash)) {
        // Let renderer know that the login was verified.
        event.reply('loginVerified', true);
      }
      else {
        event.reply('loginVerified', 'The password entered is invalid.');
      }
    }
    catch (e) {
      event.reply('loginVerified', 'An unexpected error occurred');
    }
  });
}
catch (e) {
  app.quit();
}

// Handles getting passwords.
try {
  ipcMain.on('getAllPasswords', async function(event, arg) {
    const user = arg.user;

    // Get all passwords for the given user.
    await dbService.open();

    const stmt = 'SELECT * FROM Passwords WHERE appUser=(?)';

    try {
      const result = dbService.execute(stmt, [user], true, true);
      if (result.successful === true) {
        event.reply('allPasswordsRetrieved', { result: result.result });
      }
      else {
        event.reply('allPasswordsRetrieved', 'An error occurred getting your passwords.');
      }
    }
    catch (e) {
      event.reply('allPasswordsRetrieved', 'An unexpected error occurred.');
    }
  });
}
catch (e) {
  app.quit();
}