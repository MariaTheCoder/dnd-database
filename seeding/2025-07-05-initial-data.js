if (!process.env.DB_FILE) {
  console.error("DB_FILE entry missing in environment");
  process.exit(1);
}

import Database from "better-sqlite3";
const db = new Database(process.env.DB_FILE);
db.pragma("foreign_keys = ON");

if (process.env.DEV_MODE) {
  console.log("Seeding tables");
}

db.exec(/* sql */ `
  INSERT INTO classes (id, name, source) VALUES
  (1, 'Wizard', 'PHB'),
  (2, 'Cleric', 'PHB'),
  (3, 'Druid', 'PHB');

  INSERT INTO subclasses (id, name, class_id, source) VALUES
  (1, 'School of Evocation', 1, 'PHB'),
  (2, 'Life Domain', 2, 'PHB'),
  (3, 'Circle of the Moon', 3, 'PHB');

  INSERT INTO spells (id, name, level, castingTime, school, concentration, range, components, duration, source, class_id, subclass_id) VALUES
  (1, 'Fireball', 3, '1 action', 'Evocation', FALSE, '150 feet', 'V, S, M', 'Instantaneous', 'PHB', 1, 1),
  (2, 'Cure Wounds', 1, '1 action', 'Evocation', FALSE, 'Touch', 'V, S', 'Instantaneous', 'PHB', 2, 2),
  (3, 'Moonbeam', 2, '1 action', 'Evocation', TRUE, '120 feet', 'V, S, M', 'Concentration, up to 1 minute', 'PHB', 3, 3),
  (4, 'Mage Armor', 1, '1 action', 'Abjuration', FALSE, 'Touch', 'V, S, M', '8 hours', 'PHB', 1, NULL),
  (5, 'Guiding Bolt', 1, '1 action', 'Evocation', FALSE, '120 feet', 'V, S', 'Instantaneous', 'PHB', 2, NULL);

  INSERT INTO class_spells (class_id, spell_id) VALUES
  (1, 1), -- Wizard → Fireball
  (1, 4), -- Wizard → Mage Armor
  (2, 2), -- Cleric → Cure Wounds
  (2, 5), -- Cleric → Guiding Bolt
  (3, 3); -- Druid → Moonbeam

  INSERT INTO subclass_spells (subclass_id, spell_id) VALUES
  (1, 1), -- Evocation Wizard → Fireball
  (2, 2), -- Life Domain → Cure Wounds
  (3, 3); -- Circle of the Moon → Moonbeam
`);
