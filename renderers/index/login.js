/****************************************************
 * This helps process the user login.
 ****************************************************/
'use strict';

const { ipcRenderer } = require('electron');
const { ShaService } = require('./modules/hashing/ShaService');

// TODO: Get params from a JSON file.
const shaService = new ShaService('sha512');

// Add listener to login button.
const login = document.getElementById('login');
login.addEventListener('click', async () => 
{
    login.disabled = true;

    // Get username.
    const username = document.getElementById('username').value;
    
    // Get password.
    const password = document.getElementById('password').value

    // Hash password.
    const hash = shaService.hash(password);

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