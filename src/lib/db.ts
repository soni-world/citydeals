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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
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
  created_at: string;
}
