/****************************************************
 * Handles sending the user back to the login page.
 ****************************************************/

const { ipcRenderer } = require('electron');

let goBack = document.getElementById('goBack');
goBack.addEventListener('click', () =>
{
    ipcRenderer.send('redirectToIndexFromSignup');
}, false);