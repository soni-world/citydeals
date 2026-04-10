import { getClient, initDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  await initDb();
  const city = request.nextUrl.searchParams.get("city");
  const db = getClient();

  let result;
  if (city) {
    result = await db.execute({
      sql: "SELECT * FROM deals WHERE city = ? ORDER BY created_at DESC",
      args: [city],
    });
  } else {
    result = await db.execute("SELECT * FROM deals ORDER BY created_at DESC");
  }

  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  await initDb();
  const body = await request.json();
  const {
    title,
    description,
    price,
    category,
    city,
    lat,
    lng,
    contact_email,
    contact_phone,
  } = body;

  if (!title || !description || price == null || !city || lat == null || lng == null) {
    return NextResponse.json(
      { error: "Missing required fields: title, description, price, city, lat, lng" },
      { status: 400 }
    );
  }

  if (!contact_email && !contact_phone) {
    return NextResponse.json(
      { error: "At least one contact method (email or phone) is required" },
      { status: 400 }
    );
  }

  const db = getClient();
  const id = uuidv4();

  await db.execute({
    sql: `INSERT INTO deals (id, title, description, price, category, city, lat, lng, contact_email, contact_phone)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, title, description, price, category || "General", city, lat, lng, contact_email || null, contact_phone || null],
  });

  const result = await db.execute({
    sql: "SELECT * FROM deals WHERE id = ?",
    args: [id],
  });

  return NextResponse.json(result.rows[0], { status: 201 });
}
