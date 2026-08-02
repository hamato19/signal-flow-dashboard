import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// حفظ أو تحديث إعدادات المستخدم
export async function POST(request: Request) {
  try {
    const { slug, username, telegram_token, telegram_chat_id } = await request.json();

    if (!slug) {
      return NextResponse.json({ success: false, error: 'الرابط التعريفي (Slug) مطلوب' }, { status: 400 });
    }

    // استخدام upsert لحفظ البيانات أو تحديثها إذا كانت موجودة مسبقاً لنفس الـ slug
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        { slug, username, telegram_token, telegram_chat_id },
        { onConflict: 'slug' }
      )
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
