import { NextResponse } from 'next/server';
import { query } from '@/utils/neonDB'; // استصال قاعدة بيانات Neon

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    // 1. جلب إعدادات المستخدم من جدول user_settings باستخدام Neon
    const userRows = await query(
      'SELECT telegram_token, telegram_chat_id, username FROM user_settings WHERE slug = $1',
      [slug]
    );

    const userSettings = userRows[0];

    if (!userSettings) {
      return NextResponse.json(
        { success: false, error: 'رابط الويب هوك غير مسجل أو غير مفعول' },
        { status: 404 }
      );
    }

    const { telegram_token, telegram_chat_id, username } = userSettings;
    const ticker = body.ticker || body.symbol || 'العملة';
    const action = body.action || body.side || 'إشارة';
    const price = body.price ? `السعر: ${body.price}` : '';
    const signalDetails = `${action.toUpperCase()} - ${ticker} ${price}`;

    let status = 'نجاح';
    let logDetails = '';

    // 2. التحقق من توفر بيانات تليجرام وإرسال الرسالة
    if (telegram_token && telegram_chat_id) {
      try {
        const telegramMsg = `🚨 إشارة جديدة (${username || slug}):\nالعملة: ${ticker}\nالاجراء: ${action}\nالسعر: ${body.price || 'غير متوفر'}`;
        
        const tgResponse = await fetch(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegram_chat_id,
            text: telegramMsg,
          }),
        });

        const tgResult = await tgResponse.json();
        if (!tgResult.ok) {
          status = 'فشل';
          logDetails = `فشل الإرسال لتليجرام: ${tgResult.description || 'خطأ غير معروف'}`;
        } else {
          logDetails = `تم التوجيه بنجاح إلى تليجرام | ${signalDetails}`;
        }
      } catch (err: any) {
        status = 'فشل';
        logDetails = `خطأ في الاتصال بتليجرام: ${err.message}`;
      }
    } else {
      status = 'فشل';
      logDetails = `لم يتم إعداد توكن تليجرام لهذا المستخدم في لوحة التحكم`;
    }

    // 3. حفظ السجل مباشرة في قاعدة بيانات Neon (جدول webhook_logs)
    await query(
      'INSERT INTO webhook_logs (slug, platform, status, details, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [slug, 'Telegram', status, logDetails]
    );

    return NextResponse.json(
      { success: status === 'نجاح', message: logDetails, slug, data: body },
      { status: status === 'نجاح' ? 200 : 500 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON or server error' },
      { status: 400 }
    );
  }
}

// 4. جلب السجلات الخاصة بالـ slug لعرضها في لوحة التحكم عبر Neon
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    const logs = await query(
      'SELECT * FROM webhook_logs WHERE slug = $1 ORDER BY created_at DESC LIMIT 50',
      [slug]
    );

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ logs: [] }, { status: 500 });
  }
}
