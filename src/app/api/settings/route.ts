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

// 2. حفظ أو تحديث البيانات مع معالجة تغيير الـ Slug بشكل صحيح (POST)
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
      original_slug 
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

      // إذا كان هناك original_slug ويختلف عن الـ slug الجديد، فهذا يعني أن المستخدم قام بتغيير معرفه، نحتاج لتحديثه أو حذف القديم وإنشاء جديد
      if (original_slug && original_slug !== slug) {
        // حذف السجل القديم وإنشاء الجديد أو تحديثه مباشرة
        await client.query('DELETE FROM user_settings WHERE slug = $1', [original_slug]);
      }

      // تنفيذ عملية Upsert (إدخال أو تحديث بناءً على الـ slug)
      await client.query(
        `INSERT INTO user_settings (slug, username, telegram_token, telegram_chat_id, whatsapp_token, whatsapp_phone_id, discord_webhook) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) 
         DO UPDATE SET 
           username = EXCLUDED.username, 
           telegram_token = EXCLUDED.telegram_token, 
           telegram_chat_id = EXCLUDED.telegram_chat_id, 
           whatsapp_token = EXCLUDED.whatsapp_token, 
           whatsapp_phone_id = EXCLUDED.whatsapp_phone_id, 
           discord_webhook = EXCLUDED.discord_webhook`,
        [slug, username, telegram_token, telegram_chat_id, whatsapp_token, whatsapp_phone_id, discord_webhook]
      );

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
      await client.query('DELETE FROM user_settings WHERE `slug` = $1', [slug]);
      return NextResponse.json({ success: true, message: 'تم حذف السجل نهائياً من قاعدة البيانات' });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
