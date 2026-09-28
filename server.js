import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
});