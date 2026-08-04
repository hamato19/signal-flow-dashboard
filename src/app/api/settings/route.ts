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

    // جلب بيانات الحساب المستقل من جدول user_settings (أو الجدول المخصص لتخزين إعدادات لوحة التحكم)
    const res = await client.query(
      'SELECT * FROM user_settings WHERE slug = $1',
      [slug]
    );

    if (res.rows.length === 0) {
      console.log(`[Webhook Error] User not found for slug: ${slug}`);
      return NextResponse.json({ success: false, error: `المستخدم غير موجود بالمعرف: ${slug}` }, { status: 404 });
    }

    const settings = res.rows[0];
    
    // استخراج بيانات القنوات المخزنة في قاعدة البيانات (حسب الهيكل الجديد الذي يتم حفظه من لوحة التحكم)
    // نفترض أن الأعمدة في جدول قاعدة البيانات مخزنة بصيغة JSON أو أعمدة منفصلة مطابقة لخيارات الواجهة
    const telegramChannels = settings.telegram_channels || [];
    const whatsappChannels = settings.whatsapp_channels || [];
    const smsChannels = settings.sms_channels || [];
    const discordChannels = settings.discord_channels || [];

    const messageText = body.message || JSON.stringify(body, null, 2);
    let sentAny = false;
    let lastError = '';

    // 1. معالجة وإرسال الإشعارات عبر قنوات تليجرام المتعددة
    if (Array.isArray(telegramChannels) && telegramChannels.length > 0) {
      for (const channel of telegramChannels) {
        if (channel.token && channel.chatId) {
          try {
            const tgRes = await fetch(`https://api.telegram.org/bot${channel.token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: channel.chatId,
                text: `🔔 إشارة جديدة (حساب: ${slug})\n\n${messageText}`,
              }),
            });
            const tgData = await tgRes.json();
            if (tgData.ok) {
              sentAny = true;
            } else {
              lastError = `Telegram Error (${channel.name || 'Channel'}): ${tgData.description || 'Unknown error'}`;
            }
          } catch (err: any) {
            lastError = `Telegram Exception: ${err.message}`;
          }
        }
      }
    }

    // 2. معالجة وإرسال الإشعارات عبر قنوات واتساب (WhatsApp Cloud API)
    if (Array.isArray(whatsappChannels) && whatsappChannels.length > 0) {
      for (const wa of whatsappChannels) {
        if (wa.phoneNumberId && wa.accessToken && wa.recipientPhone) {
          try {
            const waRes = await fetch(`https://graph.facebook.com/v17.0/${wa.phoneNumberId}/messages`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${wa.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: wa.recipientPhone,
                type: 'text',
                text: { body: `🔔 إشارة جديدة عبر Webhook:\n\n${messageText}` }
              }),
            });
            const waData = await waRes.json();
            if (waRes.ok) {
              sentAny = true;
            } else {
              lastError = `WhatsApp Error: ${JSON.stringify(waData)}`;
            }
          } catch (err: any) {
            lastError = `WhatsApp Exception: ${err.message}`;
          }
        }
      }
    }

    // 3. الإرسال عبر ديسكورد إذا وجدت قنوات ديسكورد مسجلة
    if (Array.isArray(discordChannels) && discordChannels.length > 0) {
      for (const dc of discordChannels) {
        if (dc.webhookUrl) {
          try {
            const discordRes = await fetch(dc.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: `🔔 **إشارة جديدة لحساب (${slug})**\n\`\`\`json\n${messageText}\n\`\`\``,
              }),
            });
            if (discordRes.ok) {
              sentAny = true;
            } else {
              lastError = 'Discord Webhook failed to respond with OK';
            }
          } catch (err: any) {
            lastError = `Discord Exception: ${err.message}`;
          }
        }
      }
    }

    // 4. التوافق مع الحقول القديمة (التليجرام المفرد أو الديسكورد المفرد إن وجد في الجدول مباشرة)
    if (!sentAny && settings.telegram_token && settings.telegram_chat_id) {
      const tgRes = await fetch(`https://api.telegram.org/bot${settings.telegram_token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegram_chat_id,
          text: `🔔 إشارة تداول جديدة\n\n${messageText}`,
        }),
      });
      const tgData = await tgRes.json();
      if (tgData.ok) sentAny = true;
    }

    if (!sentAny) {
      return NextResponse.json({ 
        success: false, 
        error: lastError || 'لم يتم العثور على أي قناة إرسال نشطة ومجهزة بالبيانات الصحيحة في قاعدة البيانات' 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'تم معالجة الويب هوك وتوجيه الإشارة للقنوات بنجاح' });
  } catch (error: any) {
    console.error('[Webhook Exception]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
