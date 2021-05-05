/****************************************************
 * This helps signup the user.
 ****************************************************/
const { ipcRenderer } = require('electron');
const argon2 = require('argon2');
const { Argon2Service } = require('../../modules/hashing/argon2Service');
const phcFormatter = require('../../modules/phc-formatter/phcFormatter');

// TODO: Get params from a JSON file.
const argon2Service = new Argon2Service(argon2.argon2i, 2 ** 16, 50);

// Enable tooltips (Bootstrap 4.x)
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});  

// Add listner to go back button.
const goBack = document.getElementById('goBack');
goBack.addEventListener('click', () =>
{
    ipcRenderer.send('redirectToIndexFromSignup');
}, false);

// Add listeners on password inputs.
const passwordInput1 = document.getElementById("signupPassword");
const passwordInput2 = document.getElementById("verifySignupPassword");
passwordInput1.addEventListener('keyup', () => {
    const passwordLength = verifyPasswordLength(passwordInput1.value);
    const passwordMatch = verifyPasswordMatch(passwordInput1.value, passwordInput2.value);
    if (passwordLength === true && passwordMatch === true) {
        hidePasswordError();
        disableButton(false);
    }
    else {
        if (passwordLength === false) {
            showPasswordError('The password length must be at least 10 characters long.', passwordInput1);
        }
        else {
            showPasswordError('The passwords do not match.', passwordInput1);
        }
        disableButton(true);
    }
});
passwordInput2.addEventListener('keyup', () => {
    const passwordLength = verifyPasswordLength(passwordInput2.value);
    const passwordMatch = verifyPasswordMatch(passwordInput2.value, passwordInput1.value);
    if (passwordLength === true && passwordMatch === true) {
        hidePasswordError();
        disableButton(false);
    }
    else {
        if (passwordLength === false) {
            showPasswordError('The password length must be at least 10 characters long.', passwordInput2);
        }
        else {
            showPasswordError('The passwords do not match.', passwordInput2);
        }
        disableButton(true);
    }
});

// Add listener on user input.
const userNameInput = document.getElementById('signupUsername');
userNameInput.addEventListener('keyup', () => {
    if (userNameInput.value.length < 1) {
        showUserNameError('Username cannot be empty.', userNameInput);
        disableButton(true);
    }
    else if (validateUserName(userNameInput.value) === false) {
        showUserNameError('Username is not a valid email.', userNameInput);
        disableButton(true);
    }
    else {
        hideUserNameError(userNameInput);
        disableButton(false);
    }
});

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
ipcRenderer.on('userCreated', (event, arg) => 
{
    const statusMessage = document.getElementById('statusMessage');

    if (arg.successful === true) {
        statusMessage.setAttribute('class', 'alert alert-thin alert-success');
        statusMessage.innerHTML = `<i role="image" aria-label="thumbs up" class="bi bi-hand-thumbs-up"></i> <strong>You've been successfully signed up! Go back to login!</strong>`
        statusMessage.hidden = false;
    }
    else if (arg.successful === false) {
        statusMessage.setAttribute('class', 'alert alert-thin alert-danger');
        statusMessage.innerHTML = `<i role="image" aria-label="emoji frown" class="bi bi-emoji-frown"></i> <strong>${arg.message}</strong>`
        statusMessage.hidden = false;
    }
    else
    {
        statusMessage.setAttribute('class', 'alert alert-thin alert-danger');
        statusMessage.innerHTML = `<i role="image" aria-label="emoji frown" class="bi bi-emoji-frown"></i> <strong>Looks like something went wrong.</strong>`
        statusMessage.hidden = false;
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

/**
 * Disables the signup button.
 * 
 * @param {boolean} disable true if to disable the button, false if not.
 */
function disableButton(disable) {
    const button = document.getElementById('signup');
    button.disabled = disable;
}

/**
 * Shows an error for the username field.
 * 
 * @param {string} message The message to display.
 * @param {Element} userNameInput The username input field.
 */
function showUserNameError(message, userNameInput) {
    const userNameError = document.getElementById('userNameError');
    userNameError.innerText = message;
    userNameError.hidden = false;

    userNameInput.setAttribute('class', 'form-control is-invalid');
}

/**
 * Hids the error message for the username field.
 * 
 * @param {Element} userNameInput The username input field.
 */
function hideUserNameError(userNameInput) {
    const userNameError = document.getElementById('userNameError');
    userNameError.innerText = '';
    userNameError.hidden = true;

    userNameInput.setAttribute('class', 'form-control is-valid');
}

/**
 * Shows a error message for the password fields.
 * 
 * @param {string} message The message to display.
 * @param {Element} passwordInput The password input field.
 */
function showPasswordError(message, passwordInput) {
    const passwordError = document.getElementById('passwordError');
    passwordError.innerText = message;
    passwordError.hidden = false;

    passwordInput.setAttribute('class', 'form-control is-invalid');
}

/**
 * Hides the error message for the password fields.
 */
function hidePasswordError() {
    const passwordError = document.getElementById('passwordError');
    const passwordInput1 = document.getElementById('signupPassword');
    const passwordInput2 = document.getElementById('verifySignupPassword');

    passwordError.innerText = '';
    passwordError.hidden = true;

    passwordInput1.setAttribute('class', 'form-control is-valid');
    passwordInput2.setAttribute('class', 'form-control is-valid');
}