import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug; // يمثل اسم المستخدم أو المعرف الفريد مثل mohammed-zjzzc6
    const body = await request.json();

    // يمكنك هنا معالجة البيانات الواردة (مثل إرسالها إلى تيليجرام أو واتساب أو تخزينها)
    console.log(`Webhook received for user/slug: ${slug}`, body);

    return NextResponse.json(
      { success: true, message: 'Webhook received successfully', data: body },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON or server error' },
      { status: 400 }
    );
  }
}
