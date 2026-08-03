import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const client = await pool.connect();
  try {
    // فك الـ params لأنها تصنف كـ Promise في النسخ الحديثة من Next.js
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();

    // 1. جلب بيانات التوكن والـ Chat ID الخاصة بالمستخدم من قاعدة بيانات Neon
    const res = await client.query(
      'SELECT telegram_token, telegram_chat_id FROM user_settings WHERE slug = $1',
      [slug]
    );

    if (res.rows.length === 0 || !res.rows[0].telegram_token || !res.rows[0].telegram_chat_id) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على إعدادات تليجرام لهذا المستخدم في قاعدة البيانات' },
        { status: 404 }
      );
    }

    const { telegram_token, telegram_chat_id } = res.rows[0];
    const messageText = body.message || JSON.stringify(body, null, 2);

    // 2. إرسال الرسالة إلى بوت تليجرام
    const telegramUrl = `https://api.telegram.org/bot${telegram_token}/sendMessage`;
    const tgResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegram_chat_id,
        text: `🔔 *إشارة تداول جديدة*\n\n${messageText}`,
        parse_mode: 'Markdown',
      }),
    });

    const tgData = await tgResponse.json();

    if (!tgData.ok) {
      return NextResponse.json({ success: false, error: tgData.description }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم إرسال الإشارة إلى تليجرام بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

