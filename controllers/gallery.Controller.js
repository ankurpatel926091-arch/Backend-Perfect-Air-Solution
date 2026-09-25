import Gallery from "../models/gallery.model.js";
import cloudinary from "../config/cloudinary.js";



import GalleryCategory from "../models/galleryCategory.model.js";
  

export const createGallery = async (req, res) => {
  try {
    const { galleryCategory } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "perfect-air-solution/gallery",
    });

    const gallery = await Gallery.create({
      galleryCategory,

      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      isActive:true
    });

    res.status(201).json({
      message: "Gallery created successfully",
      gallery,
    });
  } catch (error) {
    console.error("Gallery Create Error:", error);

    res.status(500).json({
      message: "Failed to create gallery",
      error: error.message,
    });
  }
};



export const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find()
      .populate("galleryCategory")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Gallery fetched successfully",
      total: gallery.length,
      gallery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery",
      error: error.message,
    });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { galleryCategory } = req.body;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    // Category update
    if (galleryCategory) {
      gallery.galleryCategory = galleryCategory;
    }

    // Image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (gallery.image?.public_id) {
        await cloudinary.uploader.destroy(gallery.image.public_id);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "perfect-air-solution/gallery",
      });

      gallery.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await gallery.save();

    res.status(200).json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery",
      error: error.message,
    });
  }
};

export const updateGalleryPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { galleryCategory } = req.body;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    // Category update
    gallery.galleryCategory = galleryCategory;

    // New image upload
    if (req.file) {
      // Delete old Cloudinary image
      if (gallery.image?.public_id) {
        await cloudinary.uploader.destroy(gallery.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "perfect-air-solution/gallery",
      });

      gallery.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await gallery.save();

    res.status(200).json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery",
      error: error.message,
    });
  }
};

//patch
export const updateGalleryCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await GalleryCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Gallery category not found",
      });
    }

    category.isActive = !category.isActive;

    await category.save();

    res.status(200).json({
      message: "Gallery category status updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery category status",
      error: error.message,
    });
  }
};

//delete
export const deleteGalleryCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await GalleryCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        message: "Gallery category not found",
      });
    }

    res.status(200).json({
      message: "Gallery category deleted successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gallery category",
      error: error.message,
    });
  }
};

//delete


export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery not found",
      });
    }

    // Cloudinary se image delete
    if (gallery.image?.public_id) {
      await cloudinary.uploader.destroy(gallery.image.public_id);
    }

    // MongoDB se gallery delete
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      message: "Gallery deleted successfully",
      gallery,
    });
  } catch (error) {res.status(500).json({ message: "Failed to delete gallery",error: error.message,});
  }
};