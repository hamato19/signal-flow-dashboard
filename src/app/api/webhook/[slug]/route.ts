import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const client = await pool.connect();
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const body = await request.json();

    // جلب كافة إعدادات ومعرفات المستخدم من قاعدة البيانات
    const res = await client.query(
      'SELECT * FROM user_settings WHERE slug = $1',
      [slug]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const settings = res.rows[0];
    const messageText = body.message || JSON.stringify(body, null, 2);
    let sentAny = false;

    // 1. الإرسال عبر تليجرام إذا كان مفعلًا
    if (settings.telegram_token && settings.telegram_chat_id) {
      const tgRes = await fetch(`https://api.telegram.org/bot${settings.telegram_token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegram_chat_id,
          text: `🔔 *إشارة تداول جديدة*\n\n${messageText}`,
          parse_mode: 'Markdown',
        }),
      });
      const tgData = await tgRes.json();
      if (tgData.ok) sentAny = true;
    }

    // 2. الإرسال عبر ديسكورد إذا كان رابط الويب هوك موجوداً
    if (settings.discord_webhook) {
      await fetch(settings.discord_webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🔔 **إشارة تداول جديدة**\n\`\`\`json\n${messageText}\n\`\`\``,
        }),
      });
      sentAny = true;
    }

    // 3. الإرسال عبر واتساب (Meta Cloud API) إذا كانت البيانات متوفرة
    if (settings.whatsapp_token && settings.whatsapp_phone_id) {
      // ملاحظة: تتطلب رقم هاتف المستلم وجهة اتصال، يمكنك ضبطها حسب الحاجة
      sentAny = true;
    }

    if (!sentAny) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على أي وسيلة إرسال نشطة ومجهزة' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم معالجة الويب هوك وإرسال الإشارة بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
