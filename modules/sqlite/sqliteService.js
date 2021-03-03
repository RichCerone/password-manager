const sqlite3 = require('sqlite3').verbose();

/**
 * Manages the SQLite database.
 */
class SqliteService {
    /**
     * Manages the SQLite database.
     * 
     * @constructs SqlliteService
     * @param {string} fileName The location of the .db file.
     */
    constructor(fileName) {
        this.fileName = fileName;
        this.db = null;
    }

    /**
     * Opens a new connection to the SQLite database.
     */
    open() {
        try {
            this.db = new sqlite3.Database(this.fileName, sqlite3.OPEN_READWRITE);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Executes a SQL statement. The connection will close after
     *  execution unless specified.
     * 
     * @param {string} statement The SQL statement to execute.
     * @param {*} params Any parameters indicated by '?' in the SQL string.
     * SQL parameters should be ordered in the array in the same order they appear 
     * in the SQL statement.
     * @param {boolean} closeWhenDone Whether to close the connection after executing. 
     * Will close by default.
     */
    execute(statement, params=[], closeWhenDone=true) {
        try {
            if (this.db === null) {
                throw 'DB has not been initialized!';
            }

            this.db.serialize(function() {
                const stmt = this.prepare(statement);
                stmt.run(params);

                stmt.finalize();
            });
        }
        catch (e) {
            throw e;
        }
        finally {
            if (closeWhenDone) {
                this.db.close();
            }
        }
    }

    /**
     * Closes the database connection.
     */
    close() {
        try {
            this.db.close();
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports.SqliteService = SqliteService;