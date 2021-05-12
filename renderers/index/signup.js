/****************************************************
 * This helps redirect to render the signup page.
 ****************************************************/
'use strict';
const { ipcRenderer } = require('electron');

 let signupButton = document.getElementById('signup');
 signupButton.addEventListener('click', () =>
 {
     ipcRenderer.send('redirectSignup');
 }, false);