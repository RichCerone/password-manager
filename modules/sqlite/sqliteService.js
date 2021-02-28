const sqlite3 = require('sqlite3').verbose();

/**
 * Manages the SQLite database.
 */
class SqliteService {
    constructor(fileName) {
        this.fileName = fileName;
        this.db = null;
    }

    open() {
        try {
            this.db = new sqlite3.Database('fileName:' + this.fileName, sqlite3.OPEN_READWRITE);
        }
        catch (e) {
            throw e;
        }
    }

    execute(statement, params=[]) {
        try {
            if (db === null) {
                throw 'DB has not been initialized!';
            }

            this.db.serialize(function() {
                let stmt = db.prepare(statement);
                for (let i = 0; i < params.length; i++) {
                    stmt.run(params[i]);
                }

                stmt.finalize();
            });
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports.SqliteService = SqliteService;