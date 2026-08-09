from fastapi import FastAPI, Request, HTTPException, Header
import httpx
import asyncio

app = FastAPI(title="Hook Signal API")

# إعدادات الخدمة
SECRET_KEY = "your_secure_secret_key"  # يجب أن يتطابق مع ما تضعه في TradingView

# وظيفة إرسال إشعار لتليجرام
async def send_to_telegram(token, chat_id, message):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": chat_id, "text": message})

# وظيفة إرسال إشعار لواتساب
async def send_to_whatsapp(phone_id, token, target_phone, message):
    url = f"https://graph.facebook.com/v17.0/{phone_id}/messages"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "messaging_product": "whatsapp",
        "to": target_phone,
        "type": "text",
        "text": {"body": message}
    }
    async with httpx.AsyncClient() as client:
        await client.post(url, headers=headers, json=payload)

@app.post("/v1/webhook/{user_id}")
async def handle_webhook(
    user_id: str, 
    request: Request, 
    x_secret: str = Header(...)
):
    # 1. التحقق من مفتاح التوثيق
    if x_secret != SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid Secret Key")

    data = await request.json()
    
    # 2. تنسيق الرسالة (بناءً على بيانات TradingView)
    message = f"🚀 إشارة جديدة لـ {data.get('ticker')}\nالعملية: {data.get('action')}\nالسعر: {data.get('price')}"
    
    # 3. توجيه الإشعارات (Background Tasks للتسريع)
    # ملاحظة: قم بجلب التوكنز من قاعدة البيانات الخاصة بك هنا بناءً على user_id
    asyncio.create_task(send_to_telegram("YOUR_BOT_TOKEN", "@hooksignal_main_channel", message))
    
    return {"status": "success", "user": user_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
