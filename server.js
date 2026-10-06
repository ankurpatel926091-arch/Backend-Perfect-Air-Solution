import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dataRoutes from "./routes/data.route.js";
import constRoute from "./routes/contact.routes.js";
import galleryCategoryRoutes from "./routes/galleryCategory.routes.js";
import galleryRoutes from "./routes/gallery.Routes.js";
import brandRoutes from "./routes/brand.routes.js";
import servicesRouter from "./routes/services.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint (For Uptime Monitoring & Self-Ping)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy and active",
    timestamp: new Date().toISOString()
  });
});

// All Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/contact", constRoute);
app.use("/api/galleryCategory", galleryCategoryRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/services", servicesRouter);
app.use("/api/blogs", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Perfect Air Solution Backend is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Automated Keep-Alive Self-Ping to prevent Render Sleep Mode
  const serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
  if (serverUrl) {
    const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
    setInterval(() => {
      const pingUrl = `${serverUrl.replace(/\/$/, "")}/health`;
      https
        .get(pingUrl, (res) => {
          console.log(`[Keep-Alive Ping] Status: ${res.statusCode} at ${new Date().toLocaleTimeString()}`);
        })
        .on("error", (err) => {
          console.error("[Keep-Alive Ping Error]:", err.message);
        });
    }, PING_INTERVAL);
    console.log(`[Keep-Alive] Auto-ping initialized for ${serverUrl} every 14 minutes.`);
  }
});