const argon2 = require('argon2');

/**
 * Manages argon2 hashing.
 */
class Argon2Service {
    /**
     * Manages argon2 hashing.
     * 
     * @constructs Argon2Service
     * @param {number} type The type of argon2 algorithm to use. Accepted values: [0, 1, 2]
     * @param {number} memoryCost How much memory to use in MB.
     * @param {number} hashLength Length of the hash result.
     */
    constructor(type = argon2.argon2id, memoryCost = 64, hashLength = 50) {
        switch(type) {
            case argon2.argon2d:
                this.type = type;
                break;
            case argon2.argon2i:
                this.type = type;
                break;
            case argon2.argon2id:
                this.type = type;
                break;
            default:
                throw 'Invalid argon2 type given.'
        }
        this.memoryCost = memoryCost;
        this.hashLength = hashLength;
    }
    
    /**
     * Hashes a given string.
     * 
     * @param {string} text The text to hash.
     * @returns {Promise<string>} The hash in PHC format.
     */
    async hash(text) {
        return await argon2.hash(text, {
            type: this.type,
            memoryCost: this.memoryCost,
            hashLength: this.hashLength
        });
    }

    /**
     * Verifies the hash is legitamate with the given text.
     * 
     * @param {string} hash The hash in PHC format.
     * @param {string} text The plain text.
     * @returns {Promise<boolean>} true if the hash is legitamte, false if not.
     */
    async verify(hash, text) {
        return await argon2.verify(hash, text);
    }
}

module.exports.Argon2Service = Argon2Service;