import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// ضبط الاتصال ليعمل بسلاسة في بيئات السيرفرلس (Serverless)
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// جلب إعدادات المستخدم من قاعدة البيانات
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ success: false, error: 'معرف الحساب مفقود' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM user_settings WHERE slug = $1', [slug]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }
    return NextResponse.json({ success: true, data: res.rows[0] });
  } catch (error: any) {
    console.error('[DB GET Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

// حفظ أو تحديث إعدادات المستخدم في قاعدة البيانات
export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const { slug, telegramChannels, whatsappChannels, smsChannels, stores, tradingIntegrations, enterpriseTeams, userPlan, username } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'معرف الحساب (Slug) مطلوب للحفظ' }, { status: 400 });
    }

    const checkUser = await client.query('SELECT id FROM user_settings WHERE slug = $1', [slug]);

    if (checkUser.rows.length > 0) {
      await client.query(
        `UPDATE user_settings 
         SET telegram_channels = $1, whatsapp_channels = $2, sms_channels = $3, 
             stores = $4, trading_integrations = $5, enterprise_teams = $6, 
             user_plan = $7, username = $8, updated_at = NOW()
         WHERE slug = $9`,
        [
          JSON.stringify(telegramChannels),
          JSON.stringify(whatsappChannels),
          JSON.stringify(smsChannels),
          JSON.stringify(stores),
          JSON.stringify(tradingIntegrations),
          JSON.stringify(enterpriseTeams),
          userPlan,
          username,
          slug
        ]
      );
    } else {
      await client.query(
        `INSERT INTO user_settings 
         (slug, telegram_channels, whatsapp_channels, sms_channels, stores, trading_integrations, enterprise_teams, user_plan, username) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          slug,
          JSON.stringify(telegramChannels),
          JSON.stringify(whatsappChannels),
          JSON.stringify(smsChannels),
          JSON.stringify(stores),
          JSON.stringify(tradingIntegrations),
          JSON.stringify(enterpriseTeams),
          userPlan,
          username
        ]
      );
    }

    return NextResponse.json({ success: true, message: 'تم حفظ البيانات في قاعدة البيانات بنجاح' });
  } catch (error: any) {
    console.error('[DB POST Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
