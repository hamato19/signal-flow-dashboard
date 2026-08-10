import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const slugParam = searchParams.get('slug');

    if (!slugParam) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const slug = slugParam.trim().toLowerCase();

    client = await pool.connect();
    const result = await client.query('SELECT * FROM user_settings WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: {
          slug: slug,
          user_plan: 'free',
          telegram_channels: [],
          discord_webhook: '',
          tradingview_webhook: '',
          binance_webhook: '',
          metatrader_webhook: '',
          whatsapp_api_url: '',
          email_to: '',
          corporate_name: '',
          corporate_api_key: '',
          corporate_endpoint: '',
          upgraded_services: []
        } 
      });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('[API GET Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

export async function POST(request: Request) {
  let client;
  try {
    const body = await request.json();
    const rawSlug = body.slug;

    if (!rawSlug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    // تنظيف الـ Slug وتحويله لأحرف صغرى
    const slug = rawSlug.trim().toLowerCase();

    // التحقق من أن الـ Slug احترافي (أقل من 3 أحرف مرفوض، أو يحتوي على رموز خاصة ممنوعة)
    const slugRegex = /^[a-z0-9-]+$/;
    if (slug.length < 3 || !slugRegex.test(slug)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid slug. Must be at least 3 characters and contain only English letters, numbers, and hyphens (-) without spaces.' 
      }, { status: 400 });
    }

    // قائمة الكلمات المحجوزة في النظام
    const reservedSlugs = ['admin', 'api', 'login', 'settings', 'dashboard', 'auth', 'webhook'];
    if (reservedSlugs.includes(slug)) {
      return NextResponse.json({ 
        success: false, 
        error: 'This slug is reserved and cannot be used.' 
      }, { status: 400 });
    }

    const { 
      user_plan,
      telegramChannels,
      discord_webhook,
      tradingview_webhook,
      binance_webhook,
      metatrader_webhook,
      whatsapp_api_url,
      email_to,
      corporate_name,
      corporate_api_key,
      corporate_endpoint,
      upgraded_services 
    } = body;

    client = await pool.connect();

    await client.query(`
      INSERT INTO user_settings (
        slug, user_plan, telegram_channels, discord_webhook, 
        tradingview_webhook, binance_webhook, metatrader_webhook,
        whatsapp_api_url, email_to, corporate_name, corporate_api_key, 
        corporate_endpoint, upgraded_services, updated_at
      ) VALUES (
        $1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, NOW()
      )
      ON CONFLICT (slug) 
      DO UPDATE SET 
        user_plan = EXCLUDED.user_plan,
        telegram_channels = EXCLUDED.telegram_channels,
        discord_webhook = EXCLUDED.discord_webhook,
        tradingview_webhook = EXCLUDED.tradingview_webhook,
        binance_webhook = EXCLUDED.binance_webhook,
        metatrader_webhook = EXCLUDED.metatrader_webhook,
        whatsapp_api_url = EXCLUDED.whatsapp_api_url,
        email_to = EXCLUDED.email_to,
        corporate_name = EXCLUDED.corporate_name,
        corporate_api_key = EXCLUDED.corporate_api_key,
        corporate_endpoint = EXCLUDED.corporate_endpoint,
        upgraded_services = EXCLUDED.upgraded_services,
        updated_at = NOW();
    `, [
      slug,
      user_plan || 'free',
      JSON.stringify(telegramChannels || []),
      discord_webhook || '',
      tradingview_webhook || '',
      binance_webhook || '',
      metatrader_webhook || '',
      whatsapp_api_url || '',
      email_to || '',
      corporate_name || '',
      corporate_api_key || '',
      corporate_endpoint || '',
      JSON.stringify(upgraded_services || [])
    ]);

    return NextResponse.json({ success: true, message: 'Saved successfully', slug });
  } catch (error: any) {
    console.error('[API POST Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

