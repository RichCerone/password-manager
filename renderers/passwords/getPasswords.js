/*****************************************************
 * Handles getting the passwords and loading them.
 * ***************************************************/
'use strict'

// Get AES store on page load.
window.onload = () => {
    showLoader();

    try {
        const aesStore = window.api.getAesStore();
        
        // Get user from session.
        const user = sessionStorage.getItem('user');

        window.api.send('getAllPasswords', { user: user });
    }
    catch (e) {
        hideLoader();
        showMessage('error', 'An error occurred getting the key store.');
    }
}

window.api.on('allPasswordsRetrieved', (arg) => {
    hideLoader();

    if (arg.result.length === undefined) { // No passwords.
        showMessage('info', 'Looks like you have no passwords yet!');
    }
    else {
        // TODO: Load passwords.
        for (let i = 0; i < arg.result.length; i++) {
            buildCard(arg.result[i]);
        }
    }
});

/**
 * Shows the loader on the page.
 */
function showLoader() {
    const loader = document.getElementById('loader');
    loader.hidden = false;
}

/**
 * Hides the loader on the page.
 */
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.hidden = true;
}

/**
 * Displays a message to the user.
 * @param {string} type The type of message to display. Allowed values:
 * - Info
 * - Success
 * - Warning
 * - Error
 * @param {string} message The message to display to the user.
 */
function showMessage(type, message) {
    let messageBox;
    switch (type.toLowerCase()) {
        case 'info':
            messageBox = document.getElementById('messageBox');
            messageBox.setAttribute('class', 'alert alert-info');
            messageBox.innerHTML = `<i class="bi bi-info-circle-fill"></i> ${message}`;
            messageBox.hidden = false;
            break;

        case 'success':
            messageBox = document.getElementById('messageBox');
            messageBox.setAttribute('class', 'alert alert-success');
            messageBox.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${message}`;
            messageBox.hidden = false;
            break;

        case 'warning':
            messageBox = document.getElementById('messageBox');
            messageBox.setAttribute('class', 'alert alert-warning');
            messageBox.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
            messageBox.hidden = false;
            break;

        case 'error':
            messageBox = document.getElementById('messageBox');
            messageBox.setAttribute('class', 'alert alert-danger');
            messageBox.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
            messageBox.hidden = false;
            break;

        default: 
            throw `Type ${type} is not a valid message type.`;
    }
}

/**
 * Hides the message box on the page.
 */
function hideMessage() {
    const messageBox = document.getElementById('messageBox');
    messageBox.hidden = true;
}

/**
 * Builds and displays a card with the general password info.
 * 
 * @param {*} passwordInfo The password info to place in the card
 */
function buildCard(passwordInfo) {
    try {
        const passowrdList = document.getElementById('passwordList');

        // Create card.
        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.setAttribute('class', 'card-title');
        cardTitle.innerText = passwordInfo.passwordName;
        
        const cardText = document.createElement('p');
        cardText.setAttribute('class', 'card-text');

        let notes = 'No information';
        if (passwordInfo.notes.length > 50) {
            notes = passwordInfo.notes.substring(0, 49) + "...";
        }

        cardText.innerText = notes;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        // Create copy username button.
        const copyUserBtn = document.createElement('button');
        copyUserBtn.setAttribute('class', 'btn btn-outline-primary')
        copyUserBtn.setAttribute('type', 'button');
        copyUserBtn.innerHTML = "<i class='bi bi-person-fill'></i> Copy User";
        // TODO: register copy user action here.

        // Create copy password button.
        const copyPasswordBtn = document.createElement('button');
        copyPasswordBtn.setAttribute('class', 'btn btn-outline-primary')
        copyPasswordBtn.setAttribute('type', 'button');
        copyPasswordBtn.innerHTML = "<i class='bi bi-key-fill'></i> Copy Password";
        // TODO: register copy password action here.

        // Create view button.
        const viewBtn = document.createElement('button');
        viewBtn.setAttribute('class', 'btn btn-outline-primary')
        viewBtn.setAttribute('type', 'button');
        viewBtn.innerHTML = "<i class='bi bi-person-lines-fill'></i> View";
        // TODO: register view action here.

        // Create delete button.
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'btn btn-outline-danger')
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.innerHTML = "<i class='bi bi-person-x-fill'></i> Delete";
        // TODO: register delete action here.

        // Create row for buttons.
        const row = document.createElement('div');
        row.setAttribute('class', 'row');

        // Create column for each button.
        const copyUsercol = document.createElement('div');
        col.setAttribute('class', 'col-3');
        copyUsercol.appendChild(copyUserBtn);

        const copyPasswordCol = document.createElement('div');
        copyPasswordCol.setAttribute('class', 'col-3');
        copyPasswordCol.appendChild(copyPasswordBtn);

        const viewCol = document.createElement('div');
        viewCol.setAttribute('class', 'col-3');
        viewCol.appendChild(viewBtn)

        const deleteCol = document.createElement('div');
        deleteCol.setAttribute('class', 'col-3');
        deleteCol.appendChild(deleteBtn);

        // Add columns to row.
        row.appendChild(copyUsercol);
        row.appendChild(copyPasswordCol);
        row.appendChild(viewCol);
        row.appendChild(deleteCol);

        // Add row to bottom of card body.
        cardBody.appendChild(row);
        
        card.appendChild(cardBody);

        passowrdList.appendChild(card);
    }
    catch (e) {
        showMessage('error', 'An unexpected error occurred trying to display the passwords.');
    }
}
