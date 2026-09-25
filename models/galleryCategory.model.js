import mongoose from "mongoose";

const galleryCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryCategory = mongoose.model("GalleryCategory", galleryCategorySchema);

export default GalleryCategory;
