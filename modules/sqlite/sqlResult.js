
/**
 * Represents the result from using the SqliteService.
 */
class SqlResult {
    /**
     * Represents the result from using the SqliteService.
     * 
     * @constructs SqlResult
     * @param {string} message Any application specific message to return.
     * @param {boolean} successful true if the statement executed successfully--false if not.
     * @param {boolean} uniqueException true if the entery already exists--false if not.
     * @param {*} result The results of the query (if any)
     * @param {string} sqlMsg SQLite specific message for logging purposes.
     */
    constructor(message = null, successful = false, uniqueException = false, result = null, sqlMsg = '') {
        this.message = message;
        this.successful = successful;
        this.uniqueException = uniqueException;
        this.result = result;
        this.sqlMsg = sqlMsg
    }
}

module.exports.SqlResult = SqlResult;