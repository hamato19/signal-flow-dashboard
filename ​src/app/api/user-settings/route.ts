import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// إنشاء دالة الاتصال باستخدام Neon Serverless
const sql = neon(process.env.DATABASE_URL!);

// جلب إعدادات المستخدم (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default_user';

    const result = await sql`
      SELECT settings_data FROM user_settings WHERE user_id = ${userId}
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: true,
        settings: {
          telegram: { enabled: false, botToken: '', chatId: '' },
          whatsapp: { enabled: false, instanceId: '', token: '' },
          discord: { enabled: false, webhookUrl: '' },
          slack: { enabled: false, webhookUrl: '' },
          email: { enabled: false, smtpHost: '', smtpPort: '', user: '', pass: '' },
          sms: { enabled: false, provider: '', apiKey: '', senderId: '' },
          trading: { enabled: false, apiKey: '', apiSecret: '', sandbox: true },
          ecommerce: { enabled: false, platform: '', storeUrl: '', accessToken: '' },
          companyDepartments: { hr: true, sales: true, support: true, development: true },
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings: result[0].settings_data,
    });

  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

// حفظ أو تحديث إعدادات المستخدم (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'default_user', settings } = body;

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // إدخال أو تحديث البيانات باستخدام صيغة Upsert المتوافقة مع Neon
    const result = await sql`
      INSERT INTO user_settings (user_id, settings_data, updated_at)
      VALUES (${userId}, ${JSON.stringify(settings)}::jsonb, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET 
        settings_data = EXCLUDED.settings_data,
        updated_at = NOW()
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      data: result[0],
    });

  } catch (error: any) {
    console.error('Error saving user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings', details: error.message },
      { status: 500 }
    );
  }
}
