// This file creates the initial db file and populates it with the tables as defined in our
// database-design.dbml
// We are only concerned with creating our tables for now, not with DROPping them.

if (!process.env.DB_FILE) {
  console.error("DB_FILE entry missing in environment");
  process.exit(1);
}

import Database from "better-sqlite3";
const db = new Database(process.env.DB_FILE);
db.pragma("foreign_keys = ON");

if (process.env.DEV_MODE) {
  console.log("Creating tables");
}

db.exec(/* sql */ `
  -- Table: classes
  CREATE TABLE classes (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    source VARCHAR NOT NULL
  );

  -- Table: subclasses
  CREATE TABLE subclasses (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    class_id INTEGER NOT NULL,
    source VARCHAR NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id)
  );

  -- Table: spells
  CREATE TABLE spells (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    level INTEGER NOT NULL,
    castingTime VARCHAR NOT NULL,
    school VARCHAR NOT NULL,
    concentration BOOLEAN NOT NULL,
    range VARCHAR NOT NULL,
    components VARCHAR NOT NULL,
    duration VARCHAR NOT NULL,
    source VARCHAR NOT NULL,
    class_id INTEGER,
    subclass_id INTEGER,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subclass_id) REFERENCES subclasses(id)
  );

  -- Table: subclass_spells (junction table)
  CREATE TABLE subclass_spells (
    subclass_id INTEGER,
    spell_id INTEGER,
    PRIMARY KEY (subclass_id, spell_id),
    FOREIGN KEY (subclass_id) REFERENCES subclasses(id),
    FOREIGN KEY (spell_id) REFERENCES spells(id)
  );

  -- Table: class_spells (junction table)
  CREATE TABLE class_spells (
    class_id INTEGER,
    spell_id INTEGER,
    PRIMARY KEY (class_id, spell_id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (spell_id) REFERENCES spells(id)
  );
`);
