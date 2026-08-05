import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// إعداد الاتصال بقاعدة بيانات Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// دالة لجلب إعدادات المستخدم (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default_user'; // استبدل بآلية المصвідقة الحقيقية لديك (NextAuth / Clert إلخ)

    const client = await pool.connect();
    
    // جلب البيانات من جدول الإعدادات
    const result = await client.query(
      'SELECT settings_data FROM user_settings WHERE user_id = $1',
      [userId]
    );
    
    client.release();

    if (result.rows.length === 0) {
      // إرجاع هيكل افتراضي في حال عدم وجود سجل سابق
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
      settings: result.rows[0].settings_data,
    });

  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

// دالة لحفظ أو تحديث إعدادات المستخدم (POST / PUT)
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

    const client = await pool.connect();

    // استخدام صيغة Upsert (الإدخال أو التحديث تلقائياً في حال وجود المستخدم)
    const query = `
      INSERT INTO user_settings (user_id, settings_data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET 
        settings_data = EXCLUDED.settings_data,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await client.query(query, [userId, JSON.stringify(settings)]);
    client.release();

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      data: result.rows[0],
    });

  } catch (error: any) {
    console.error('Error saving user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings', details: error.message },
      { status: 500 }
    );
  }
}
