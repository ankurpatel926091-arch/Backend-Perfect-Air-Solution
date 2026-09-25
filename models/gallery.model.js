import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    galleryCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GalleryCategory",
      default: null,
    },
    image: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
      },
    },
    isActive:{
      type:Boolean
    }
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
