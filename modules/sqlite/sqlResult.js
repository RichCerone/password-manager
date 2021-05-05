
/**
 * Represents the result from using the SqliteService.
 */
class SqlResult {
    /**
     * 
     * @constructs SqlResult
     * @param {string} message Any application specific message to return.
     * @param {boolean} successful true if the statement executed successfully--false if not.
     * @param {boolean} uniqueException true if the entery already exists--false if not.
     * @param {*} sqlMsg SQLite specific message for logging purposes.
     */
    constructor(message = '', successful = false, uniqueException = false, sqlMsg = '') {
        this.message = message;
        this.successful = successful;
        this.uniqueException = uniqueException;
        this.sqlMsg = sqlMsg
    }
}

module.exports.SqlResult = SqlResult;