import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { createProxyMiddleware } from 'http-proxy-middleware';  // ✅ أضف هذا السطر

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
]);

const configuredFrontendUrl = process.env.FRONTEND_URL?.replace(/\/+$/, "");
if (configuredFrontendUrl) {
  allowedOrigins.add(configuredFrontendUrl);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// ✅ Proxy لتوجيه طلبات API من نفس النطاق (لحل مشكلة CORS و Safari)
app.use(
  '/api/telegram',
  createProxyMiddleware({
    target: 'https://stakeme-api.onrender.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/telegram': '/api/telegram',
    },
  })
);

app.use("/api", router);

export default app;
