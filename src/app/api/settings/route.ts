import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 1. جلب البيانات عند الدخول أو تحديث الصفحة (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'الرأس (slug) مطلوب' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM user_settings WHERE slug = $1', [slug]);
      if (res.rows.length === 0) {
        return NextResponse.json({ success: true, settings: null });
      }
      return NextResponse.json({ success: true, settings: res.rows[0] });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. حفظ أو تحديث البيانات مع التحقق من عدم تعارض الـ Slug (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      slug, 
      username, 
      telegram_token, 
      telegram_chat_id, 
      whatsapp_token, 
      whatsapp_phone_id, 
      discord_webhook,
      original_slug // (اختياري) تمريره إذا كان المستخدم يقوم بتعديل إعداداته الحالية
    } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'الرأس (slug) مطلوب' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // التحقق مما إذا كان الـ Slug الجديد مستخدماً مسبقاً من قِبل شخص آخر
      const checkSlug = await client.query('SELECT slug FROM user_settings WHERE slug = $1', [slug]);
      
      if (checkSlug.rows.length > 0 && original_slug !== slug) {
        return NextResponse.json(
          { success: false, error: 'اسم المستخدم (Slug) مستخدم بالفعل من قبل شخص آخر، يرجى اختيار اسم غيره.' }, 
          { status: 400 }
        );
      }

      const existing = await client.query('SELECT slug FROM user_settings WHERE slug = $1', [slug]);

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE user_settings 
           SET username = $1, telegram_token = $2, telegram_chat_id = $3, 
               whatsapp_token = $4, whatsapp_phone_id = $5, discord_webhook = $6 
           WHERE slug = $7`,
          [username, telegram_token, telegram_chat_id, whatsapp_token, whatsapp_phone_id, discord_webhook, slug]
        );
      } else {
        await client.query(
          `INSERT INTO user_settings (slug, username, telegram_token, telegram_chat_id, whatsapp_token, whatsapp_phone_id, discord_webhook) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [slug, username, telegram_token, telegram_chat_id, whatsapp_token, whatsapp_phone_id, discord_webhook]
        );
      }

      return NextResponse.json({ success: true, message: 'تم حفظ كافة الإعدادات بنجاح في قاعدة البيانات' });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. مسح السجل نهائياً من قاعدة البيانات (DELETE)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'الرأس (slug) مطلوب' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('DELETE FROM user_settings WHERE slug = $1', [slug]);
      return NextResponse.json({ success: true, message: 'تم حذف السجل نهائياً من قاعدة البيانات' });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
