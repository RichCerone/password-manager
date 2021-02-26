/****************************************************
 * This helps signup the user.
 ****************************************************/

const { ipcRenderer } = require('electron');

let signupButton = document.getElementById('signup');
signupButton.addEventListener('click', () =>
{
    ipcRenderer.send('signupUser');
}, false);