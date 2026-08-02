import { NextResponse } from 'next/server';

const userWebhooks: Record<string, any[]> = {};

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    if (!userWebhooks[slug]) {
      userWebhooks[slug] = [];
    }
    userWebhooks[slug].unshift({
      time: new Date().toLocaleTimeString(),
      body,
    });

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

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  return NextResponse.json({
    slug,
    logs: userWebhooks[slug] || []
  });
}
