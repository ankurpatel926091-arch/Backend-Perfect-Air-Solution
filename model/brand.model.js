import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  brandName: { type: String, trim: true },
  tagline: { type: String, trim: true },
  overview: { type: String, trim: true },
  heroImage: { type: String },
  logo: { type: String },
  website: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);
