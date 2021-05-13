/*****************************************************
 * Exposes select node.js APIs to renderer process.
 * ***************************************************/

// Will leave for debugging purposes.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })

// Define needed libraries for UI.
const { contextBridge, ipcRenderer } = require('electron');
const { ShaService } = require('./modules/hashing/ShaService');
const { AesService } = require('./modules/hashing/AesService');

// Init services.
const shaService = new ShaService();
const aesService = new AesService('./aes/aes-store.json', 32, 'AES-GCM');

// Define a list of allowed channels.
const sendChannels = [
    'redirectSignup',
    'verifyLogin',
    'redirectToIndexFromSignup',
    'signupUser',
    'redirectPasswords'
]

const onChannels = [
    'loginVerified',
    'userCreated'
]

// Exposes public API for select processes.
contextBridge.exposeInMainWorld(
    'api',
    {
        send: (channel, data) => {
            if (sendChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
            else {
                console.warn(`Bad send channel ${channel} declared.`); // TODO: Will eventually just log this.
            }
        },
        on: (channel, func) => {
            if (onChannels.includes(channel)) {
                ipcRenderer.on(channel, (events, args) => func(args))
            }
            else {
                console.warn(`Bad on channel ${channel} declared.`); // TODO: Will eventually just log this.
            }
        },
        shaHash: (mode, text) => {
            shaService.setMode(mode);
            return shaService.hash(text);
        }
    }
);