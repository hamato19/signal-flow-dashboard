// src/utils/errorHandler.js (أو في المجلد المناسب لمشروعك)
export function handleApiError(err, customMessage = "حدث خطأ غير متوقع") {
    console.error("Error Details:", err);
    
    // استخراج رسالة الخطأ النصية بشكل آمن لتظهر واضحة على الجوال
    const errorMessage = err?.message || JSON.stringify(err);
    
    // إظهار رسالة تنبيه واضحة للمستخدم على الشاشة
    alert(`${customMessage}:\n${errorMessage}`);
}
