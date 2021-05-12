/****************************************************
 * This helps redirect to render the signup page.
 ****************************************************/
'use strict'
 
 let signupButton = document.getElementById('signup');
 signupButton.addEventListener('click', () =>
 {
     window.api.send('redirectSignup');
 }, false);