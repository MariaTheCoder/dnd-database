const Database = require("better-sqlite3");

let db;

if (!db) {
  db = new Database("db.sqlite");
}

module.exports = db;
