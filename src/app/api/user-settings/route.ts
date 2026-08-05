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
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const rawText = await request.text();
    let body: any = {};
    
    if (rawText && rawText.trim() !== '') {
      try {
        body = JSON.parse(rawText);
      } catch (parseError) {
        body = { message: rawText };
      }
    } else {
      body = { message: "طلب ويب هوك فارغ بدون محتوى" };
    }

    console.log(`[Webhook] Receiving request for slug: ${slug}`);

    client = await pool.connect();

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
    
    // طباعة كامل محتوى السجل في الـ Logs لتتمكن من رؤيته بوضوح على Render
    console.log('[Webhook Debug] Full User Settings from DB:', JSON.stringify(settings, null, 2));

    const messageText = body.message || JSON.stringify(body, null, 2);
    let sentAny = false;
    let lastError = '';

    // جلب القنوات بشكل مرن (سواء كانت في telegram_channels أو أعمدة أخرى)
    const telegramChannels = settings.telegram_channels || settings.telegramChannels || [];
    
    if (Array.isArray(telegramChannels) && telegramChannels.length > 0) {
      for (const channel of telegramChannels) {
        // البحث عن التوكن والـ Chat ID بأي اسم محتمل للمفتاح
        const token = channel.botToken || channel.token || channel.bot_token || channel.telegram_token || channel.apiKey;
        const chatId = channel.chatId || channel.chat_id || channel.id;

        console.log('[Telegram Parsed Channel]:', { hasToken: !!token, hasChatId: !!chatId, channelData: channel });

        if (token && chatId) {
          try {
            const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
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
      }
    }

    // ديسكورد
    const discordWebhookUrl = settings.discord_webhook || settings.discordWebhook;
    if (discordWebhookUrl) {
      try {
        const discordRes = await fetch(discordWebhookUrl, {
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
        error: lastError || 'لم يتم العثور على توكن تليجرام أو شات آي دي صالحين داخل مصفوفة القنوات' 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم معالجة الويب هوك وإرسال الإشارة بنجاح' });

  } catch (error: any) {
    console.error('[Webhook Exception]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
