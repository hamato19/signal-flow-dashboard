import { NextResponse } from 'next/server';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

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

// حفظ أو تحديث إعدادات المستخدم في قاعدة البيانات بناءً على الهيكلة الجديدة
export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const {
      slug,
      username,
      email,
      timezone,
      language,
      telegram_token,
      telegram_chat_id,
      telegram_parse_mode,
      telegram_disable_notification,
      telegram_protect_content,
      discord_webhook,
      discord_username,
      discord_avatar_url,
      discord_embed_color,
      whatsapp_token,
      whatsapp_phone_id,
      whatsapp_from_number,
      whatsapp_business_account_id,
      slack_webhook,
      slack_channel,
      slack_username,
      slack_icon_emoji,
      teams_webhook,
      teams_theme_color,
      teams_summary,
      custom_webhook,
      message_template,
      webhook_secret,
      routing_rules,
      templates,
      logs,
      analytics
    } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'معرف الحساب (Slug) مطلوب للحفظ' }, { status: 400 });
    }

    const checkUser = await client.query('SELECT slug FROM user_settings WHERE slug = $1', [slug]);

    if (checkUser.rows.length > 0) {
      // تحديث البيانات
      await client.query(
        `UPDATE user_settings 
         SET username = $1, email = $2, timezone = $3, language = $4,
             telegram_token = $5, telegram_chat_id = $6, telegram_parse_mode = $7, 
             telegram_disable_notification = $8, telegram_protect_content = $9,
             discord_webhook = $10, discord_username = $11, discord_avatar_url = $12, discord_embed_color = $13,
             whatsapp_token = $14, whatsapp_phone_id = $15, whatsapp_from_number = $16, whatsapp_business_account_id = $17,
             slack_webhook = $18, slack_channel = $19, slack_username = $20, slack_icon_emoji = $21,
             teams_webhook = $22, teams_theme_color = $23, teams_summary = $24,
             custom_webhook = $25, message_template = $26, webhook_secret = $27,
             routing_rules = $28, templates = $29, logs = $30, analytics = $31,
             updated_at = NOW()
         WHERE slug = $32`,
        [
          username, email, timezone, language,
          telegram_token, telegram_chat_id, telegram_parse_mode, telegram_disable_notification, telegram_protect_content,
          discord_webhook, discord_username, discord_avatar_url, discord_embed_color,
          whatsapp_token, whatsapp_phone_id, whatsapp_from_number, whatsapp_business_account_id,
          slack_webhook, slack_channel, slack_username, slack_icon_emoji,
          teams_webhook, teams_theme_color, teams_summary,
          custom_webhook, message_template, webhook_secret,
          JSON.stringify(routing_rules || []),
          JSON.stringify(templates || []),
          JSON.stringify(logs || []),
          JSON.stringify(analytics || {}),
          slug
        ]
      );
    } else {
      // إدخال جديد
      await client.query(
        `INSERT INTO user_settings 
         (slug, username, email, timezone, language, telegram_token, telegram_chat_id, telegram_parse_mode, 
          telegram_disable_notification, telegram_protect_content, discord_webhook, discord_username, 
          discord_avatar_url, discord_embed_color, whatsapp_token, whatsapp_phone_id, whatsapp_from_number, 
          whatsapp_business_account_id, slack_webhook, slack_channel, slack_username, slack_icon_emoji, 
          teams_webhook, teams_theme_color, teams_summary, custom_webhook, message_template, 
          webhook_secret, routing_rules, templates, logs, analytics) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)`,
        [
          slug, username, email, timezone, language,
          telegram_token, telegram_chat_id, telegram_parse_mode, telegram_disable_notification, telegram_protect_content,
          discord_webhook, discord_username, discord_avatar_url, discord_embed_color,
          whatsapp_token, whatsapp_phone_id, whatsapp_from_number, whatsapp_business_account_id,
          slack_webhook, slack_channel, slack_username, slack_icon_emoji,
          teams_webhook, teams_theme_color, teams_summary,
          custom_webhook, message_template, webhook_secret,
          JSON.stringify(routing_rules || []),
          JSON.stringify(templates || []),
          JSON.stringify(logs || []),
          JSON.stringify(analytics || {}),
        ]
      );
    }

    return NextResponse.json({ success: true, message: 'تم حفظ إعدادات المنصة بنجاح' });
  } catch (error: any) {
    console.error('[DB POST Error]:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
