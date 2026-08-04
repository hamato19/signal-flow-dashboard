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

    console.log(`[Webhook] Receiving request for slug: ${slug}`);

    // جلب كافة إعدادات ومعرفات المستخدم من قاعدة البيانات
    const res = await client.query(
      'SELECT * FROM user_settings WHERE slug = $1',
      [slug]
    );

    if (res.rows.length === 0) {
      console.log(`[Webhook Error] User not found for slug: ${slug}`);
      return NextResponse.json({ success: false, error: `المستخدم غير موجود بالمعرف: ${slug}` }, { status: 404 });
    }

    const settings = res.rows[0];
    console.log('[Webhook Debug] Settings found:', {
      hasTelegramToken: !!settings.telegram_token,
      hasTelegramChatId: !!settings.telegram_chat_id,
      hasDiscord: !!settings.discord_webhook
    });

    const messageText = body.message || JSON.stringify(body, null, 2);
    let sentAny = false;
    let lastError = '';

    // 1. الإرسال عبر تليجرام (بدون استخدام parse_mode لتجنب مشاكل الرموز الخاصة)
    if (settings.telegram_token && settings.telegram_chat_id) {
      const tgRes = await fetch(`https://api.telegram.org/bot${settings.telegram_token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegram_chat_id,
          text: `🔔 إشارة تداول جديدة\n\n${messageText}`,
        }),
      });
      const tgData = await tgRes.json();
      console.log('[Telegram Response]:', tgData);
      
      if (tgData.ok) {
        sentAny = true;
      } else {
        lastError = `Telegram Error: ${tgData.description || 'Unknown error'}`;
      }
    }

    // 2. الإرسال عبر ديسكورد إذا كان رابط الويب هوك موجوداً
    if (settings.discord_webhook) {
      const discordRes = await fetch(settings.discord_webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🔔 **إشارة تداول جديدة**\n\`\`\`json\n${messageText}\n\`\`\``,
        }),
      });
      if (discordRes.ok) {
        sentAny = true;
      } else {
        lastError = 'Discord Webhook failed to respond with OK';
      }
    }

    if (!sentAny) {
      return NextResponse.json({ 
        success: false, 
        error: lastError || 'لم يتم العثور على أي وسيلة إرسال نشطة أو فشل الإرسال عبر الوسائط المتاحة' 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم معالجة الويب هوك وإرسال الإشارة بنجاح' });
  } catch (error: any) {
    console.error('[Webhook Exception]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
