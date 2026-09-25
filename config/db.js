import dns from "dns";
import mongoose from "mongoose";

// Fix querySrv ECONNREFUSED issue by setting Google DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB_NAME || "perfect_air_solution",
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;