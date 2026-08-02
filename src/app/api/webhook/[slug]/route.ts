import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء اتصال بـ Supabase باستخدام صلاحيات السيرفر
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    // 1. جلب إعدادات المستخدم من جدول user_settings بناءً على الـ slug
    const { data: userSettings, error: dbError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('slug', slug)
      .single();

    if (dbError || !userSettings) {
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

    // 3. حفظ السجل مباشرة في قاعدة بيانات Supabase (جدول webhook_logs)
    await supabase.from('webhook_logs').insert([
      {
        slug: slug,
        platform: 'Telegram',
        status: status,
        details: logDetails,
      }
    ]);

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

// 4. جلب السجلات الخاصة بالـ slug لعرضها في لوحة التحكم
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  
  const { data: logs, error } = await supabase
    .from('webhook_logs')
    .select('*')
    .eq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ logs: [] }, { status: 500 });
  }

  return NextResponse.json({ logs });
}
