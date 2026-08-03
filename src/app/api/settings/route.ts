import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, username, telegram_token, telegram_chat_id } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'الرأس (slug) مطلوب' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM user_settings WHERE slug = $1', [slug]);

    if (existing.length > 0) {
      await query(
        `UPDATE user_settings 
         SET username = $1, telegram_token = $2, telegram_chat_id = $3 
         WHERE slug = $4`,
        [username, telegram_token, telegram_chat_id, slug]
      );
    } else {
      await query(
        `INSERT INTO user_settings (slug, username, telegram_token, telegram_chat_id) 
         VALUES ($1, $2, $3, $4)`,
        [slug, username, telegram_token, telegram_chat_id]
      );
    }

    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'الرأس (slug) مطلوب' }, { status: 400 });
    }

    const rows = await query('SELECT * FROM user_settings WHERE slug = $1', [slug]);

    if (rows.length === 0) {
      return NextResponse.json({ success: true, settings: null });
    }

    return NextResponse.json({ success: true, settings: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

