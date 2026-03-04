/**
 * Project Name: Aura
 * Description: A social networking platform with automated content moderation and context-based authentication system.
 *
 * Author: Aarogya Ojha
 * Email: [EMAIL_ADDRESS]
 * Date: 4th March 2026
 */

require("dotenv").config();

// ── Environment validation ─────────────────────────────────────────────────
const required = ["MONGODB_URI", "JWT_SECRET"];
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[FATAL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
const passport = require("passport");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const notificationRoutes = require("./routes/notification.route");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");

const app = express();

const PORT = process.env.PORT || 4000;

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);

// ── Security middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow static assets from CDN/browser
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(mongoSanitize()); // prevent NoSQL injection
app.use(hpp()); // prevent HTTP Parameter Pollution
app.use(compression()); // gzip all responses

// ── Logging & body parsing ─────────────────────────────────────────────────
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static assets ──────────────────────────────────────────────────────────
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
);

// ── Auth ───────────────────────────────────────────────────────────────────
app.use(passport.initialize());
require("./config/passport.js");

// ── Health check ───────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? "ok" : "degraded";
  res.status(dbState === 1 ? 200 : 503).json({
    status,
    db: ["disconnected", "connected", "connecting", "disconnecting"][dbState],
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

// ── Routes (API v1) ────────────────────────────────────────────────────────
app.get("/api/v1/search", decodeToken, search);

app.use("/api/v1/auth", contextAuthRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/communities", communityRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// ── Legacy route compatibility (keep old paths working) ───────────────────
app.get("/search", decodeToken, search);
app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRoutes);

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Global error handler ───────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== "production";

  console.error(`[ERROR] ${err.message}`, isDev ? err.stack : "");

  res.status(statusCode).json({
    message: err.message || "An unexpected error occurred",
    ...(isDev && { stack: err.stack }),
  });
});

// ── Real-time (Socket.IO) ──────────────────────────────────────────────────
const http = require("http");
const socket = require("./utils/socket");

const server = http.createServer(app);
socket.init(server);

// ── Graceful shutdown ──────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  try {
    await db.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.listen(PORT, () =>
  console.log(`[SERVER] Aura running on port ${PORT} (${process.env.NODE_ENV || "development"})`)
);
