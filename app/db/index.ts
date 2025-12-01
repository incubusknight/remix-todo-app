import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// This ensures that the database file is created in a known location.
// We'll go ahead and ensure the database is created if it doesn't exist.
// In a real application, this would be handled differently, possibly with migrations (not the focus of this project)
const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const DB_PATH = path.join(DB_DIR, 'todos.db');

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL
  );
`);

export default db;