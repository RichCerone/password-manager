/****************************************************
 * This helps redirect to render the signup page.
 ****************************************************/

let signupButton = document.getElementById('signup');
signupButton.addEventListener('click', () =>
{
    ipcRenderer.send('redirectSignup');
}, false);