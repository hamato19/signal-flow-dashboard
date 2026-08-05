import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  let client;
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // قراءة نص الطلب أولاً لمنع انهيار السيرفر في حال كان الجسم فارغاً أو غير صالح
    const rawText = await request.text();
    let body: any = {};
    
    if (rawText && rawText.trim() !== '') {
      try {
        body = JSON.parse(rawText);
      } catch (parseError) {
        // إذا لم يكن النص بصيغة JSON صحيحة، نعتبره رسالة نصية مباشرة
        body = { message: rawText };
      }
    } else {
      body = { message: "طلب ويب هوك فارغ بدون محتوى" };
    }

    console.log(`[Webhook] Receiving request for slug: ${slug}`);

    // الاتصال بقاعدة البيانات
    client = await pool.connect();

    // جلب إعدادات المستخدم بناءً على الـ slug
    const res = await client.query(
      'SELECT * FROM user_settings WHERE slug = $1',
      [slug]
    );

    if (res.rows.length === 0) {
      console.log(`[Webhook Error] User not found for slug: ${slug}`);
      return NextResponse.json(
        { success: false, error: `المستخدم غير موجود بالمعرف: ${slug}` }, 
        { status: 404 }
      );
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

    // 1. الإرسال عبر تليجرام
    if (settings.telegram_token && settings.telegram_chat_id) {
      try {
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
      } catch (tgErr: any) {
        console.error('[Telegram Exception]:', tgErr.message);
        lastError = `Telegram Exception: ${tgErr.message}`;
      }
    }

    // 2. الإرسال عبر ديسكورد
    if (settings.discord_webhook) {
      try {
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
      } catch (discordErr: any) {
        console.error('[Discord Exception]:', discordErr.message);
        lastError = `Discord Exception: ${discordErr.message}`;
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
    if (client) {
      client.release(); // تحرير اتصال قاعدة البيانات بأمان لمنع تسريب الاتصالات (Connection Leaks)
    }
  }
}
