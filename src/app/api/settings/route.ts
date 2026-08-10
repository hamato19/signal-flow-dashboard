import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: Request) {
  let client;
  try {
    const body = await request.json();
    const { 
      slug, 
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

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    client = await pool.connect();

    // حفظ البيانات مع دعم مصفوفة قنوات تليجرام كـ JSONB
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

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error: any) {
    console.error('[API POST Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
