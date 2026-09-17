import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { defaultRateLimiter } from "./middleware/rateLimitMiddleware.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import businessCategoryRoutes from "./routes/businessCategoryRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

// Security & platform middleware
app.use(helmet());
const allowedOrigins = Array.from(new Set([env.clientOrigin, "http://localhost:5173", "http://127.0.0.1:5173"].filter(Boolean)));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(defaultRateLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Route groups — one per domain
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/business-categories", businessCategoryRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
