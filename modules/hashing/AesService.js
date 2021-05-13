const forge = require('node-forge');
const fs = require('fs');

/**
 * Manages AES encryption.
 */
class AesService {
    /**
     * Encrypts data using AES.
     * 
     * @constructs AesService
     * @param {string} pathToAesStore path to the AES parameters JSON file.
     * @param {number} byteSize The number of bytes to use when generating the key and IV.
     * 32 bytes used by default. Exception with GCM mode; IV will use 12 bytes. Key size 
     * determines AES size:
     * - 16 => AES-128
     * - 24 => AES-192
     * - 32 => AES-256
     * @param {string} mode The AES mode to use for encrypting. Default is 'AES-GCM'.
     * Accepted values:
     * - 'AES-GCM'
     * - 'AES-ECB'
     * - 'AES-CBC'
     * - 'AES-CFB'
     * - 'AES-OFB'
     * - 'AES-CTR'
     */
    constructor(pathToAesStore, byteSize = 32, mode = 'AES-GCM') {
        this.pathToAesStore = pathToAesStore;
        this.byteSize = byteSize;

        switch (mode.toUpperCase()) {
            case 'AES-GCM':
                this.mode = 'AES-GCM';
                break;

            case 'AES-ECB':
                this.mode = 'AES-ECB';
                break;

            case 'AES-CBC':
                this.mode = 'AES-CBC';
                break;

            case 'AES-CFB':
                this.mode = 'AES-CFB';
                break;
            
            case 'AES-OFB':
                this.mode = 'AES-OFB';
                break;

            case 'AES-CTR':
                this.mode = 'AES-CTR';
                break;

            default:
                throw `The mode ${mode} is not a valid AES mode.`;
        }

        this.key = '';
        this.iv = '';
        this.gcmTag = '';
    }

    /**
     * Gets the AES parameter file. If the file does not exist, it will 
     * be created and populated with new AES parameters.
     */
    getAesStore() {
        try {
            if (fs.existsSync(this.pathToAesStore)) {
                const aesStore = fs.readFileSync(this.pathToAesStore);
                const params = JSON.parse(aesStore);

                this.key = params.key;
                this.iv = params.iv;
            }
            else { // Create file with new AES parameters.
                this.generateAesParameters(this.byteSize);
                fs.writeFileSync(this.pathToAesStore, `{ "key": "${this.key}", "iv": "${this.iv}" }`);
            }
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Writes new AES parameters to the file store.
     */
    writeToAesStore() {
        try {
            if (fs.existsSync(this.pathToAesStore)) {
                fs.writeFileSync(this.pathToAesStore, `{ "key": "${this.key}", "iv": "${this.iv}" }`);
            }
            else {
                throw `File path: ${this.pathToAesStore} does not exist.`;
            }
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Generates and sets new AES parameters.
     * 
     * @param {number} byteSize The number of bytes to use for generating
     * the key and IV.
     */
    generateAesParameters(byteSize) {
        try {
            this.key = forge.util.bytesToHex(forge.random.getBytesSync(byteSize));
        
            if (this.mode === 'AES-GCM') {
                this.iv = forge.util.bytesToHex(forge.random.getBytesSync(12)); // Forge recommends 12 byte IV.
            }
            else {
                this.iv = forge.util.bytesToHex(forge.random.getBytesSync(byteSize));
            }
        }
        catch (e) {
            throw e;
        }
    }


    encrypt(text) {
        try {
            if (this.mode === 'AES-GCM') {
                const  cipher = forge.cipher.createCipher('AES-GCM', forge.util.hexToBytes(this.key));

                cipher.start({iv: forge.util.hexToBytes(this.iv)});
                cipher.update(forge.util.createBuffer(someBytes));
                cipher.finish();

                const encrypted = cipher.output;
                this.gcmTag = cipher.mode.tag;

                return encrypted.toHex()
            }
            else {
                const cipher = forge.cipher.createCipher(this.mode, forge.util.hexToBytes(this.key));

                cipher.start({iv: forge.util.hexToBytes(this.iv)});
                cipher.update(forge.util.createBuffer(text));
                cipher.finish();

                return cipher.output.toHex();
            }
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * 
     * @param {*} encryptedData 
     * @returns 
     */
    decrypt(encryptedData) {
        try {
            if (this.mode === 'AES-GCM') {
                const encryptedBytes = forge.util.hexToBytes(encryptedData);
                const decipher = forge.cipher.createDecipher(this.mode, forge.util.hexToBytes(this.key));

                decipher.start({
                    iv: forge.util.hexToBytes(this.iv),
                    tag: this.gcmTag
                });
                decipher.update(encryptedBytes);

                const result = decipher.finish();
                
                if(result) {
                    return decipher.output.toString();
                }
                else {
                    throw 'Could not decrypt the given data with the key.'
                }
            }
            else {
                const encryptedBytes = forge.util.hexToBytes(encryptedData);
                const decipher = forge.cipher.createDecipher(this.mode, forge.util.hexToBytes(this.key));

                decipher.start({iv: forge.util.hexToBytes(this.iv)});
                decipher.update(encryptedBytes);
                
                const result = decipher.finish();

                if (result) {
                    return decipher.output.toString('utf8');
                }
                else {
                    throw 'Could not decrypt the given data with the key.'
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports.AesService = AesService;