/****************************************************
 * This helps process the user login.
 ****************************************************/
'use strict'

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
    const hash = window.api.shaHash('sha512', password);

    // Compare with hash in db.
    window.api.send('verifyLogin', {user: username, hash: hash});
});

// Add listener for when verify login calls back.
window.api.on('loginVerified', (arg) => {
    login.disabled = false;

    if (arg === true) {
        hideError();
        
        // Set user in session.
        const username = document.getElementById('username').value;
        sessionStorage.setItem('user', username);

        window.api.send('redirectPasswords');
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