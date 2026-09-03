import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { defaultRateLimiter } from "./middleware/rateLimitMiddleware.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import feasibilityRoutes from "./routes/feasibilityRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Security & platform middleware
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(defaultRateLimiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Route groups — one per domain, matching the frontend service layer
app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/feasibility", feasibilityRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
