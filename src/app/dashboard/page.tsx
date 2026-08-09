from fastapi import FastAPI, Request, HTTPException, Header, BackgroundTasks
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="Hook Signal Full API", version="2.4.1")

# المفتاح السري العام أو يمكن جذبه من قاعدة البيانات لاحقاً
MASTER_SECRET = os.getenv("MASTER_SECRET", "my_secure_secret_2026")

class SignalPayload(dlant=None):
    pass

# دالة إرسال تليجرام
async def send_telegram(token: str, chat_id: str, text: str):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"})
        except Exception as e:
            print(f"Telegram Error: {e}")

# دالة إرسال واتساب (WhatsApp Cloud API)
async def send_whatsapp(phone_id: str, token: str, to: str, text: str):
    url = f"https://graph.facebook.com/v17.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, headers=headers, json=payload)
        except Exception as e:
            print(f"WhatsApp Error: {e}")

# دالة إرسال إيميل (عبر SMTP أو خدمة خارجية مثل SendGrid / Resend)
async def send_email(email_to: str, subject: str, body: str):
    # يمكنك ربطها بـ SendGrid أو بريد السيرفر هنا
    print(f"Sending Email to {email_to}: {subject} - {body}")

# دالة إرسال SMS / تنبيهات سريعة (مثل Pushover المذكورة في الواجهة أو Twilio)
async def send_sms_or_pushover(service_key: str, message: str):
    # مثال باستخدام خدمة Pushover الموجودة في تصميمك
    url = "https://api.pushover.net/1/messages.json"
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, data={"token": service_key, "user": "USER_KEY", "message": message})
        except Exception as e:
            print(f"SMS/Pushover Error: {e}")

# 1. ويب هوك خاص بقسم التداول (TradingView, Binance, وغيرها)
@app.post("/v1/webhook/trading/{user_id}")
async def trading_webhook(
    user_id: str, 
    request: Request, 
    background_tasks: BackgroundTasks,
    x_secret: str = Header(None)
):
    if x_secret and x_secret != MASTER_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Secret Key")
    
    data = await request.json()
    
    # استخراج بيانات التداول (تناسب TradingView و Binance)
    symbol = data.get('ticker') or data.get('symbol', 'UNKNOWN')
    action = data.get('action') or data.get('side', 'SIGNAL')
    price = data.get('price', '0.00')
    source = data.get('source', 'TradingView')
    
    formatted_msg = (
        f"📊 *إشارة تداول جديدة [{source}]*\n"
        f"🔹 الزوج/العملة: `{symbol}`\n"
        f"🔸 الإجراء: *{action}*\n"
        f"💵 السعر الحالي: `{price}`"
    )
    
    # هنا يتم جلب قنوات المستخدم (Telegram, WhatsApp) من قاعدة البيانات بناءً على user_id
    # كمثال توضيحي نقوم بالإرسال المباشر أو وضعها في الخلفية BackgroundTasks:
    
    # background_tasks.add_task(send_telegram, "YOUR_BOT_TOKEN", "@your_channel", formatted_msg)
    
    return {
        "status": "success", 
        "section": "trading", 
        "user": user_id, 
        "received_data": data
    }

# 2. ويب هوك خاص بقسم الشركات والأعمال (إشعارات الإداريين والـ B2B)
@app.post("/v1/webhook/corporate/{user_id}")
async def corporate_webhook(
    user_id: str, 
    request: Request, 
    background_tasks: BackgroundTasks,
    x_secret: str = Header(None)
):
    if x_secret and x_secret != MASTER_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Secret Key")
    
    data = await request.json()
    title = data.get('title', 'تنبيه إداري للشركات')
    description = data.get('description', '')
    
    formatted_msg = (
        f"🏢 *قسم الشركات - إشعار جديد*\n"
        f"📌 *{title}*\n"
        f"📝 التفاصيل: {description}"
    )
    
    return {
        "status": "success", 
        "section": "corporate", 
        "user": user_id, 
        "message": "Corporate alert processed successfully"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
