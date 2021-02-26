/****************************************************
 * Handles sending the user back to the login page.
 ****************************************************/

const { ipcRenderer } = require('electron');

let signupButton = document.getElementById('goBack');
signupButton.addEventListener('click', () =>
{
    ipcRenderer.send('redirectToIndexFromSignup');
}, false);