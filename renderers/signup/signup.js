/****************************************************
 * This helps signup the user.
 ****************************************************/
const { ipcRenderer } = require('electron');
const argon2 = require('argon2');
const { Argon2Service } = require('../../modules/hashing/argon2Service');
const phcFormatter = require('../../modules/phc-formatter/phcFormatter').default;

// TODO: Get params from a JSON file.
const argon2Service = new Argon2Service(argon2.argon2i, 2 ** 16, 50);

// Add listner to go back button.
let goBack = document.getElementById('goBack');
goBack.addEventListener('click', () =>
{
    ipcRenderer.send('redirectToIndexFromSignup');
}, false);

// 

// Add listener to signup button.
const signupButton = document.getElementById('signup');
signupButton.addEventListener('click', async () =>
{
    const user = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    // Encrypt password and get hash.
    const encryptedPassword = await argon2Service.hash(password);
    const hash = phcFormatter.getHash(encryptedPassword);

    ipcRenderer.send('signupUser', {user: user, hash: hash});
}, false);

// Add listener for when user is created.
ipcRenderer.on('userCreated', (arg) => 
{
    const statusMessage = document.getElementById('statusMessage');

    if (arg === true) {
        statusMessage.setAttribute('class', 'alert alert-thin alert-success');
        statusMessage.innerHTML = `<i role="image" aria-label="thumbs up" class="bi bi-hand-thumbs-up"></i> <strong>You've been successfully signed up! Go back to login!</strong>`
    }
    else
    {
        statusMessage.setAttribute('class', 'alert alert-thin alert-error');
        statusMessage.innerHTML = `<i role="image" aria-label="emoji frown" class="bi bi-emoji-frown"></i> <strong>Looks like something went wrong.</strong>`
    }
});

/**
 * Does a basic validation check to see if the email fits
 * the minimum guidelines for a valid email. This does 
 * not check to see if the email exists.
 * 
 * @param {string} username The user's email address.
 */
function validateUserName(username) {
    const regex = /\S+@\S+\.\S+/;
    
    return regex.test(username);
}

/**
 * Verifies the password is at least 10 characters.
 * 
 * @param {string} password The password to verify.
 * 
 * @return {boolean} true if the password is 10 or more characters
 * long, false if not.
 */
function verifyPasswordLength(password) {
    if (password.trim().length >= 10) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Verifies both passwords entered match.
 * 
 * @param {string} password1 The first password entered by the user.
 * @param {string} password2 The second password entered by the user.
 * 
 * @return {boolean} true if the passwords match or false if not.
 */
function verifyPasswordMatch(password1, password2) {
    if (password1 === password2) {
        return true;
    }
    else {
        return false;
    }
}