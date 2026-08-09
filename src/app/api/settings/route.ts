import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// دالة لجلب إعدادات المستخدم عبر Query Parameter (?slug=...)
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

// دالة لحفظ أو تحديث إعدادات المستخدم
export async function POST(request: Request) {
  let client;
  try {
    const body = await request.json();
    const { 
      slug, 
      username, 
      userPlan, 
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

    client = await pool.connect();

    await client.query(`
      INSERT INTO user_settings (
        slug, username, user_plan, telegram_channels, whatsapp_channels, 
        slack_channels, discord_channels, email_channels, sms_channels, 
        stores, trading_integrations, enterprise_teams, updated_at
      ) VALUES (
        $1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb, NOW()
      )
      ON CONFLICT (slug) 
      DO UPDATE SET 
        username = EXCLUDED.username,
        user_plan = EXCLUDED.user_plan,
        telegram_channels = EXCLUDED.telegram_channels,
        whatsapp_channels = EXCLUDED.whatsapp_channels,
        slack_channels = EXCLUDED.slack_channels,
        discord_channels = EXCLUDED.discord_channels,
        email_channels = EXCLUDED.email_channels,
        sms_channels = EXCLUDED.sms_channels,
        stores = EXCLUDED.stores,
        trading_integrations = EXCLUDED.trading_integrations,
        enterprise_teams = EXCLUDED.enterprise_teams,
        updated_at = NOW();
    `, [
      slug,
      username || '',
      userPlan || 'free',
      JSON.stringify(telegramChannels || []),
      JSON.stringify(whatsappChannels || []),
      JSON.stringify(slackChannels || []),
      JSON.stringify(discordChannels || []),
      JSON.stringify(emailChannels || []),
      JSON.stringify(smsChannels || []),
      JSON.stringify(stores || []),
      JSON.stringify(tradingIntegrations || []),
      JSON.stringify(enterpriseTeams || [])
    ]);

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error: any) {
    console.error('[API POST Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
