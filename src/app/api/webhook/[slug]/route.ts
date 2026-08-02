import { NextResponse } from 'next/server';

// قاعدة بيانات مؤقتة لتخزين آخر الإشارات لكل مستخدم (اختياري للاختبار السريع)
const userWebhooks: Record<string, any[]> = {};

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // تخزين الإشارة في الذاكرة المؤقتة مؤقتاً
    if (!userWebhooks[slug]) {
      userWebhooks[slug] = [];
    }
    userWebhooks[slug].unshift({
      time: new Date().toLocaleTimeString(),
      body,
    });

    console.log(`Webhook received for slug: ${slug}`, body);

    return NextResponse.json(
      { success: true, message: 'Webhook received successfully', slug, data: body },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON or server error' },
      { status: 400 }
    );
  }
}

// ميزة اضافية: يمكنك جلب الإشارات المستلمة عبر متصفحك مباشرة بطلب GET للتأكد
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  return NextResponse.json({
    slug,
    logs: userWebhooks[slug] || []
  });
}
