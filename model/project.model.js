import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  completionDate: { type: String },
  images: [{ type: String }], // Array of Cloudinary URLs
  featuredImage: { type: String } // Main Cloudinary URL
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
