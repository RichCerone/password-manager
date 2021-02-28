/****************************************************
 * This helps signup the user.
 ****************************************************/

let signupButton = document.getElementById('signup');
signupButton.addEventListener('click', () =>
{
    ipcRenderer.send('signupUser');
}, false);