import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:citydeals.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function initDb() {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      city TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      contact_email TEXT,
      contact_phone TEXT,
      expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  // Add expires_at column if table already existed without it
  await db.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (key TEXT PRIMARY KEY)
  `);
  const migrated = await db.execute({
    sql: "SELECT key FROM _migrations WHERE key = ?",
    args: ["add_expires_at"],
  });
  if (migrated.rows.length === 0) {
    try {
      await db.execute("ALTER TABLE deals ADD COLUMN expires_at TEXT");
    } catch {
      // Column already exists
    }
    await db.execute({
      sql: "INSERT OR IGNORE INTO _migrations (key) VALUES (?)",
      args: ["add_expires_at"],
    });
  }
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  lat: number;
  lng: number;
  contact_email: string | null;
  contact_phone: string | null;
  expires_at: string | null;
  created_at: string;
}
