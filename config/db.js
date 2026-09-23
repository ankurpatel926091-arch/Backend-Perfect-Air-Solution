import mongoose from "mongoose";
import dns from "node:dns";

// Prevent querySrv ECONNREFUSED on local Windows/ISP networks
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Ignore in environments where setServers is restricted
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      console.warn("⚠️ MONGODB_URL is missing from .env");
      return;
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'perfect_air_solution',
    });
    console.log(`✅ MongoDB Connected to database: ${process.env.MONGODB_DB_NAME || 'perfect_air_solution'}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.error("   (Ensure your IP is whitelisted in MongoDB Atlas Network Access: 0.0.0.0/0)");
  }
};

export default connectDB;