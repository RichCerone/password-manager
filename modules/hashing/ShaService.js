const forge = require('node-forge');

/**
 * Manages SHA512 hashing.
 */
class ShaService {
    /**
     * Creates a new ShaService.
     *
     *  @param {string} mode The SHA algorthim to use. SHA512 used by default. 
     *                       Supported types: ['sha512', 'sha384', 'sha256']
     */
    constructor(mode = 'sha512') {
        switch (mode) {
            case 'sha512':
                this.mode = mode;
                break;
            
            case 'sha384':
                this.mode = mode;
                break;

            case 'sha256':
                this.mode = mode;
                break;

            default:
                throw `The mode ${mode} is not a valid SHA mode.`;
        }
    }

    /**
     * Sets the SHA mode.
     * 
     * @param {string} mode The SHA algorthim to use. SHA512 used by default. 
     *                      Supported types: ['sha512', 'sha384', 'sha256']
     */
    setMode(mode) {
        switch (mode) {
            case 'sha512':
                this.mode = mode;
                break;

            case 'sha384':
                this.mode = mode;
                break;

            case 'sha256':
                this.mode = mode;
                break;

            default:
                throw `The mode ${mode} is not a valid SHA mode.`;
        }
    }

    /**
     * Hashes the given key based on the SHA setup mode.
     * 
     * @param {string} key The key to be hashed.
     * @returns The hex result of the hash.
     */
    hash(key) {
        let sha;
        switch (this.mode) {
            case 'sha512':
                sha = forge.md.sha512.create();
                break;

            case 'sha384': 
                sha = forge.md.sha384.create();
                break;

            case 'sha256':
                sha = forge.md.sha256.create();
                break;

            default:
                throw `The mode ${mode} is not a valid SHA mode.`;
        }

        try {
            sha.update(key);
            return sha.digest().toHex();
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports.ShaService = ShaService;