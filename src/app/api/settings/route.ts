import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    client = await pool.connect();
    const result = await client.query('SELECT * FROM user_settings WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: true, data: null });
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
    const { 
      slug, 
      user_plan,
      subscription_status,
      subscription_expiry,
      lifetime_access,
      telegram_token,
      telegram_chat_id,
      discord_webhook,
      tradingview_webhook,
      binance_webhook,
      metatrader_webhook,
      whatsapp_api_url,
      whatsapp_token,
      email_to,
      sms_endpoint,
      corporate_name,
      corporate_api_key,
      corporate_endpoint,
      upgraded_services,
      telegramChannels, 
      whatsappChannels, 
      slackChannels, 
      discordChannels, 
      emailChannels, 
      smsChannels, 
      stores, 
      tradingIntegrations, 
      enterpriseTeams 
    } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    let finalTelegramChannels = telegramChannels;
    if (!finalTelegramChannels && telegram_token) {
      finalTelegramChannels = [{ token: telegram_token, chatId: telegram_chat_id }];
    }

    let finalDiscordChannels = discordChannels;
    if (!finalDiscordChannels && discord_webhook) {
      finalDiscordChannels = [{ webhook: discord_webhook }];
    }

    client = await pool.connect();

    // التأكد من وجود الجدول والأعمدة، وتحديث البيانات
    await client.query(`
      INSERT INTO user_settings (
        slug, user_plan, subscription_status, subscription_expiry, lifetime_access,
        telegram_token, telegram_chat_id, discord_webhook, tradingview_webhook, binance_webhook, metatrader_webhook,
        whatsapp_api_url, whatsapp_token, email_to, sms_endpoint, corporate_name, corporate_api_key, corporate_endpoint,
        telegram_channels, whatsapp_channels, slack_channels, discord_channels, email_channels, sms_channels, 
        stores, trading_integrations, enterprise_teams, upgraded_services, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19::jsonb, $20::jsonb, $21::jsonb, $22::jsonb, $23::jsonb, $24::jsonb, $25::jsonb, $26::jsonb, $27::jsonb, $28::jsonb, NOW()
      )
      ON CONFLICT (slug) 
      DO UPDATE SET 
        user_plan = EXCLUDED.user_plan,
        subscription_status = EXCLUDED.subscription_status,
        subscription_expiry = EXCLUDED.subscription_expiry,
        lifetime_access = EXCLUDED.lifetime_access,
        telegram_token = EXCLUDED.telegram_token,
        telegram_chat_id = EXCLUDED.telegram_chat_id,
        discord_webhook = EXCLUDED.discord_webhook,
        tradingview_webhook = EXCLUDED.tradingview_webhook,
        binance_webhook = EXCLUDED.binance_webhook,
        metatrader_webhook = EXCLUDED.metatrader_webhook,
        whatsapp_api_url = EXCLUDED.whatsapp_api_url,
        whatsapp_token = EXCLUDED.whatsapp_token,
        email_to = EXCLUDED.email_to,
        sms_endpoint = EXCLUDED.sms_endpoint,
        corporate_name = EXCLUDED.corporate_name,
        corporate_api_key = EXCLUDED.corporate_api_key,
        corporate_endpoint = EXCLUDED.corporate_endpoint,
        telegram_channels = EXCLUDED.telegram_channels,
        whatsapp_channels = EXCLUDED.whatsapp_channels,
        slack_channels = EXCLUDED.slack_channels,
        discord_channels = EXCLUDED.discord_channels,
        email_channels = EXCLUDED.email_channels,
        sms_channels = EXCLUDED.sms_channels,
        stores = EXCLUDED.stores,
        trading_integrations = EXCLUDED.trading_integrations,
        enterprise_teams = EXCLUDED.enterprise_teams,
        upgraded_services = EXCLUDED.upgraded_services,
        updated_at = NOW();
    `, [
      slug,
      user_plan || 'free',
      subscription_status || 'active',
      subscription_expiry || null,
      lifetime_access || false,
      telegram_token || '',
      telegram_chat_id || '',
      discord_webhook || '',
      tradingview_webhook || '',
      binance_webhook || '',
      metatrader_webhook || '',
      whatsapp_api_url || '',
      whatsapp_token || '',
      email_to || '',
      sms_endpoint || '',
      corporate_name || '',
      corporate_api_key || '',
      corporate_endpoint || '',
      JSON.stringify(finalTelegramChannels || []),
      JSON.stringify(whatsappChannels || []),
      JSON.stringify(slackChannels || []),
      JSON.stringify(finalDiscordChannels || []),
      JSON.stringify(emailChannels || []),
      JSON.stringify(smsChannels || []),
      JSON.stringify(stores || []),
      JSON.stringify(tradingIntegrations || []),
      JSON.stringify(enterpriseTeams || []),
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
