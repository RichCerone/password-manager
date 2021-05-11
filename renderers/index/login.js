/****************************************************
 * This helps process the user login.
 ****************************************************/
const { ipcRenderer } = require('electron');
const argon2 = require('argon2');
const { Argon2Service } = require('./modules/hashing/argon2Service');
const phcFormatter = require('./modules/phc-formatter/phcFormatter');

// TODO: Get params from a JSON file.
const argon2Service = new Argon2Service(argon2.argon2i, 2 ** 16, 50);

// Add listener to login button.
const login = document.getElementById('login');
login.addEventListener('click', async () => 
{
    login.disabled = true;

    // Get username.
    const username = document.getElementById('username').value;
    
    // Get password.
    const password = document.getElementById('password').value

    // Hash password and get hash.
    const encryptedPassword = await argon2Service.hash(password);
    const hash = phcFormatter.getHash(encryptedPassword);

    // Compare with hash in db.
    ipcRenderer.send('verifyLogin', {user: username, hash: hash});
});

// Add listener for when verify login calls back.
ipcRenderer.on('loginVerified', (event, arg) => {
    if (arg === true) {
        hideError();

        ipcRenderer.send('redirectPasswords');
    }
    else if (arg === false) {
        showError("The username and password is not valid.");
    }
    else {
        showError(arg);
    }
});

/**
 * Shows the error message on the page.
 * @param {string} message The message to display.
 */
function showError(message) {
   const errorMessage = document.getElementById('errorMessage');

   errorMessage.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
   errorMessage.hidden = false;
}

/**
 * Hides the error message on the page.
 */
function hideError() {
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.innerHTML = '';
    errorMessage.hidden = true;
}