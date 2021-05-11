const initSqlJs = require('sql.js');
const { SqlResult } = require('./sqlResult');
const fs = require('fs');

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
    async open() {
        try {
            const fileBuffer = fs.readFileSync(this.fileName);
            const SQL = await initSqlJs({
                locationFile: './node_modules/sql.js/dist/sql-wasm.wasm'
            });
            this.db = new SQL.Database(fileBuffer);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Executes a SQL statement. The connection will close after
     * execution unless specified.
     * 
     * @param {string} statement The SQL statement to execute.
     * @param {*} params Any parameters indicated by '?' in the SQL string.
     * SQL parameters should be ordered in the array in the same order they appear 
     * in the SQL statement.
     * @param {boolean} closeWhenDone Whether to close the connection after executing. 
     * Will close by default.
     * @param {boolean} returnResultAsObj Whether to return the result of the query as an object.
     * @returns {SqlResult} the result of executing the SQL statement.
     */
    execute(statement, params=[], closeWhenDone=true, returnResultAsObj=false) {
        let result = new SqlResult();
        let stmt = null;

        try {
            if (this.db === null) {
                throw 'DB has not been initialized!';
            }

            stmt = this.db.prepare(statement);
            stmt.bind(params);
            
            let res = null;
            if (returnResultAsObj) {
                res = stmt.getAsObject(params);
            }
            else {
                res = stmt.step();
            }

            result = new SqlResult('', true, false, res, '');
        }
        catch (e) {
            if (e.message.includes("UNIQUE constraint failed")) {
                result = new SqlResult('This entry already exists.', false, true, null, e.message);
            }
            else {
                throw e;
            }
        }
        finally {
            this.save();

            if (stmt !== null) {
                stmt.free();
            }
            
            if (closeWhenDone && this.db !== null) {
                this.db.close();
                return result;
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

    /**
     * Saves the database changes.
     */
    save() {
        try {
            const data = this.db.export();
            const buffer = new Buffer.from(data);

            fs.writeFileSync(this.fileName, buffer);
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports.SqliteService = SqliteService;