import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  let client;
  try {
    const { slug } = await params;
    console.log(`[Webhook] Receiving request for slug: ${slug}`);

    const body = await request.json().catch(() => ({}));

    client = await pool.connect();
    const result = await client.query('SELECT * FROM user_settings WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User slug not found' }, { status: 404 });
    }

    const settings = result.rows[0];
    
    // استخراج قنوات التليجرام من المصفوفة JSONB أو الحقول التقليدية احتياطياً
    let channels = [];
    if (settings.telegram_channels) {
      try {
        channels = typeof settings.telegram_channels === 'string' 
          ? JSON.parse(settings.telegram_channels) 
          : settings.telegram_channels;
      } catch (e) {
        channels = [];
      }
    }

    // إذا لم توجد في المصفوفة، نتحقق من الحقل المفرد إن وجد
    if (channels.length === 0 && settings.telegram_token && settings.telegram_chat_id) {
      channels = [{ token: settings.telegram_token, chatId: settings.telegram_chat_id }];
    }

    console.log(`[Webhook Debug] Found ${channels.length} Telegram channels for slug: ${slug}`);

    let sentSuccessfully = false;

    // 1. الإرسال لكل قنوات تليجرام المفعلة ديناميكياً
    for (const channel of channels) {
      if (channel.token && channel.chatId) {
        const messageText = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
        const telegramUrl = `https://api.telegram.org/bot${channel.token}/sendMessage`;
        
        const tgRes = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: channel.chatId,
            text: `🔔 إشعار تداول جديد:\n\`\`\`json\n${messageText}\n\`\`\``,
            parse_mode: 'Markdown'
          })
        });

        if (tgRes.ok) {
          sentSuccessfully = true;
        }
      }
    }

    // 2. الإرسال عبر ديسكورد إن وجد
    if (settings.discord_webhook) {
      const dcRes = await fetch(settings.discord_webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `🔔 إشعار جديد:\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`` })
      });
      if (dcRes.ok) sentSuccessfully = true;
    }

    if (!sentSuccessfully) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على أي قناة إرسال نشطة أو فشل الاتصال بالمنصات' 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed and sent successfully' });

  } catch (error: any) {
    console.error('[Webhook Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
