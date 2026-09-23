import "dotenv/config.js";
import express from "express";
import { upload } from './config/cloudinary.js';
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import orderRoutes from "./routes/order.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import projectRoutes from "./routes/project.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : [];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed =
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('localhost');
      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true
  })
);
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    brand: "Perfect Air Solution",
    message: "Perfect Air Solution Backend API is running 🚀",
    timestamp: new Date()
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blogs", blogRoutes); 
app.use("/api/services", serviceRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bookings", bookingRoutes);

// Generic Upload Route
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ message: err.message || 'Image upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ imageUrl: req.file.path });
  });
});

app.post('/api/upload-multiple', (req, res) => {
  upload.array('images')(req, res, function (err) {
    if (err) {
      console.error('Multiple Upload Error:', err);
      return res.status(500).json({ message: err.message || 'Multiple images upload failed' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const imageUrls = req.files.map(file => file.path);
    res.status(200).json({ imageUrls });
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Backend Error:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Perfect Air Solution API Server running on port ${PORT}`);
});