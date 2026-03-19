import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { env } from '../config/index.js';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function migrate() {
  const dbDir = dirname(env.databasePath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }

  const schemaPath = join(__dirname, '../../database/schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  const db = new Database(env.databasePath);
  db.pragma('journal_mode = WAL');
  db.exec(schema);
  db.close();

  console.log('Migration complete. Database initialized at:', env.databasePath);
}

migrate();
