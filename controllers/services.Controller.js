import cloudinary from "../config/cloudinary.js";
import Services from "../models/services.model.js";

export const createServices = async (req, res) => {
  try {
    const {
      slug,
      title,
      badge,
      tagline,
      desc,
      longDesc,
      price,
      duration,
      rating,
      reviews,
      icon,
      highlights,
      process,
      isActive,
    } = req.body;

    // Required fields
    if (!slug || !title) {
      return res.status(400).json({
        success: false,
        message: "Slug and title are required",
      });
    }

    // Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "perfect-air-solution/Services",
    });

    const blog = new Blog({
      slug,
      title,
      badge,
      tagline,
      desc,
      longDesc,
      price,
      duration,
      rating,
      reviews,
      icon,

      image: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },

      highlights: highlights
        ? JSON.parse(highlights)
        : [],

      process: process
        ? JSON.parse(process)
        : [],

      isActive: isActive === "false" ? false : true,
    });

    const savedBlog = await Services.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};