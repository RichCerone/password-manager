    /**
     * Gets the hash from the PHC formatted string.
     * @param {string} phcString The PHC formatted string.
     * @description PHC string format example: '$argon2i$v=19$m=4096,t=3,p=1$SX5sc9gOkbvc4wum7EDYRg$3ZlnlCa8+Si4tqbHAnRqMFvWu3QfH4zysPGX7buE0mI'.
     */
    function getHash(phcString) {
        try {
            const p = phcString.split(',');
            const hash = p[p.length - 1].substring(3, p[p.length - 1].length);
            return hash[hash.length - 1];
        }
        catch (e) {
            throw e;
        }
    }

module.exports = { getHash }