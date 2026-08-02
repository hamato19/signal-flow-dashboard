import { NextResponse } from 'next/server';

// سجل عام للعمليات ليظهر في لوحة التحكم
export const globalLogs: any[] = [];

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    // استخراج تفاصيل الإشارة (مثل العملة والسعر والاتجاه)
    const ticker = body.ticker || body.symbol || 'العملة';
    const action = body.action || body.side || 'إشارة';
    const price = body.price ? `السعر: ${body.price}` : '';
    const signalDetails = `${action.toUpperCase()} - ${ticker} ${price}`;

    // يمكنك هنا جلب إعدادات تليجرام (يفضل تخزينها في قاعدة بيانات أو متغيرات بيئية، أو جلبها بحسب رغبتك)
    // كمثال افتراضي، سنقوم بمحاولة الإرسال إذا توفر توكن البوت
    const telegramToken = process.env.TELEGRAM_TOKEN || ''; 
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || '';

    let status: 'نجاح' | 'فشل' = 'نجاح';
    let logDetails = `إشارة واردة: ${signalDetails}`;

    if (telegramToken && telegramChatId) {
      try {
        const telegramMsg = `🚨 إشارة جديدة:\nالعملة: ${ticker}\nالاجراء: ${action}\nالسعر: ${body.price || 'غير متوفر'}`;
        const tgResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
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
      // في حال لم يتم ضبط بوت تليجرام بعد، يتم تسجيل استلام الإشارة بنجاح في الويب هوك
      status = 'نجاح';
      logDetails = `تم استلام الإشارة بنجاح (تليجرام غير مفعّل) | ${signalDetails}`;
    }

    // إضافة العملية إلى سجل العمليات (Logs)
    const newLog = {
      id: Date.now().toString(),
      time: 'الآن',
      endpoint: `/api/webhook/${slug}`,
      platform: 'Telegram',
      status: status,
      details: logDetails
    };

    globalLogs.unshift(newLog);

    return NextResponse.json(
      { success: status === 'نجاح', message: logDetails, slug, data: body },
      { status: status === 'نجاح' ? 200 : 500 }
    );

  } catch (error: any) {
    // تسجيل حالة الفشل إذا حدث خطأ في استقبال الـ JSON أو السيرفر
    const errorLog = {
      id: Date.now().toString(),
      time: 'الآن',
      endpoint: `/api/webhook/unknown`,
      platform: 'Telegram',
      status: 'فشل' as const,
      details: `خطأ في معالجة الطلب: ${error.message}`
    };
    globalLogs.unshift(errorLog);

    return NextResponse.json(
      { success: false, error: 'Invalid JSON or server error' },
      { status: 400 }
    );
  }
}

// جلب السجلات لعرضها في لوحة التحكم
export async function GET() {
  return NextResponse.json({
    logs: globalLogs
  });
}
