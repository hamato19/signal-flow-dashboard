import { NextResponse } from 'next/server';

// قاعدة بيانات مؤقتة تفصل إشارات كل مستخدم لوحده
const userWebhooks: Record<string, any[]> = {};

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    if (!userWebhooks[token]) {
      userWebhooks[token] = [];
    }

    const newLog = {
      id: Date.now(),
      eventType: body.title || body.event || 'إشارة جديدة',
      raw: body,
      time: new Date().toLocaleTimeString()
    };

    userWebhooks[token].unshift(newLog);
    if (userWebhooks[token].length > 50) userWebhooks[token].pop();

    return NextResponse.json({ status: 'success', token, receivedData: newLog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { token } = await params;
  const logs = userWebhooks[token] || [];
  return NextResponse.json({ token, logs }, { status: 200 });
}

