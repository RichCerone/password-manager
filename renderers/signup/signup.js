/****************************************************
 * This helps signup the user.
 ****************************************************/
const { ipcRenderer } = require('electron');

const argon2 = require('argon2');
const { SqliteService } = require('../../modules/sqlite/sqliteService');

// TODO: Get path from a JSON file.
const dbService = new SqliteService('../../db/password-manager.db');

// Add listner to go back button.
let goBack = document.getElementById('goBack');
goBack.addEventListener('click', () =>
{
    ipcRenderer.send('redirectToIndexFromSignup');
}, false);

// Add listener to signup button.
let signupButton = document.getElementById('signup');
signupButton.addEventListener('click', async () =>
{
    const user = document.getElementById('username').value;
    const password = document.getElementById('signupPassword').value;

    // Encrypt password.
    let encryptedPassword = await encryptPassword(password);
    console.log(encryptedPassword);

    // Create user.
    createUser(username, password);

    //ipcRenderer.send('signupUser');
}, false);

async function encryptPassword(password) {
    try {
        return await argon2.hash(password, { // TODO: Makes these values configurable via JSON file.
            type: argon2.argon2i,
            memoryCost: 2 ** 16,
            hashLength: 50
        });
    }
    catch (e) {
        throw e;
    }
}

function createUser(username, password) {
    try {
        dbService.open()
    }
    catch (e) {

    }
}