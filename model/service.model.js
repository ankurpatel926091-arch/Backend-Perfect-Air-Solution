import mongoose from 'mongoose';

const processSchema = new mongoose.Schema({
  step: String,
  title: String,
  desc: String
}, { _id: false });

const faqSchema = new mongoose.Schema({
  q: String,
  a: String
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true }, // Store icon name as string
  image: { type: String }, // Store Cloudinary URL for service image
  badge: { type: String },
  title: { type: String, required: true },
  tagline: { type: String },
  desc: { type: String, required: true },
  longDesc: { type: String },
  highlights: { type: [String] },
  duration: { type: String },
  price: { type: String },
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
  process: [processSchema],
  faqs: [faqSchema]
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
