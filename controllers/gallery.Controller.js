import mongoose from "mongoose";
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

    let catId = null;
    if (galleryCategory) {
      if (mongoose.Types.ObjectId.isValid(galleryCategory)) {
        catId = galleryCategory;
      } else {
        let found = await GalleryCategory.findOne({
          $or: [
            { title: new RegExp(`^${galleryCategory}$`, "i") },
            { slug: new RegExp(`^${galleryCategory}$`, "i") },
          ],
        });
        if (!found) {
          try {
            found = await GalleryCategory.create({
              title: galleryCategory,
              isActive: true,
            });
          } catch (e) {}
        }
        if (found) catId = found._id;
      }
    }

    let isActive = true;
    if (req.body.isActive !== undefined) {
      isActive = req.body.isActive === "false" || req.body.isActive === false ? false : true;
    }

    const gallery = await Gallery.create({
      galleryCategory: catId,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      isActive,
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
    const {
      category,
      status,
      page = 1,
      limit = 8,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query = {};

    // Get inactive categories to filter them out for active status
    const inactiveCategories = await GalleryCategory.find({
      isActive: false,
    }).select("_id");
    const inactiveCategoryIds = inactiveCategories.map((c) => c._id);

    // Active / Inactive filter
    if (status === "active") {
      query.isActive = { $ne: false };
      if (inactiveCategoryIds.length > 0) {
        query.galleryCategory = { $nin: inactiveCategoryIds };
      }
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    // Category filter
    if (category && category !== "all") {
      let catId = null;
      if (mongoose.Types.ObjectId.isValid(category)) {
        catId = category;
      } else {
        const foundCat = await GalleryCategory.findOne({
          title: new RegExp(`^${category}$`, "i"),
        });
        if (foundCat) {
          catId = foundCat._id;
        }
      }

      if (catId) {
        if (status === "active") {
          const isCatActive = await GalleryCategory.exists({
            _id: catId,
            isActive: { $ne: false },
          });
          if (!isCatActive) {
            query.galleryCategory = null;
          } else {
            query.galleryCategory = catId;
          }
        } else {
          query.galleryCategory = catId;
        }
      }
    }

    const activeFilter = {
      isActive: { $ne: false },
      ...(inactiveCategoryIds.length > 0
        ? { galleryCategory: { $nin: inactiveCategoryIds } }
        : {}),
    };

    // Parallel fetch for filtered count, overall counts, and gallery items
    const [totalGallery, totalCount, activeCount, gallery] = await Promise.all([
      Gallery.countDocuments(query),
      Gallery.countDocuments(),
      Gallery.countDocuments(activeFilter),
      Gallery.find(query)
        .populate("galleryCategory")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
    ]);

    const inactiveCount = totalCount - activeCount;
    res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",

      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,

      filteredTotal: totalGallery,

      page: Number(page),
      limit: Number(limit),
      foundRecords: gallery.length,
      gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
      if (mongoose.Types.ObjectId.isValid(galleryCategory)) {
        gallery.galleryCategory = galleryCategory;
      } else {
        let found = await GalleryCategory.findOne({
          $or: [
            { title: new RegExp(`^${galleryCategory}$`, "i") },
            { slug: new RegExp(`^${galleryCategory}$`, "i") },
          ],
        });
        if (!found) {
          try {
            found = await GalleryCategory.create({
              title: galleryCategory,
              isActive: true,
            });
          } catch (e) {}
        }
        if (found) {
          gallery.galleryCategory = found._id;
        }
      }
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

    // Status update
    if (req.body.isActive !== undefined) {
      gallery.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }

    await gallery.save();

    res.status(200).json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    console.error("Gallery Update Error:", error);
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
    if (galleryCategory) {
      if (mongoose.Types.ObjectId.isValid(galleryCategory)) {
        gallery.galleryCategory = galleryCategory;
      } else {
        let found = await GalleryCategory.findOne({
          $or: [
            { title: new RegExp(`^${galleryCategory}$`, "i") },
            { slug: new RegExp(`^${galleryCategory}$`, "i") },
          ],
        });
        if (!found) {
          try {
            found = await GalleryCategory.create({
              title: galleryCategory,
              isActive: true,
            });
          } catch (e) {}
        }
        if (found) {
          gallery.galleryCategory = found._id;
        }
      }
    }

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

    // Status update
    if (req.body.isActive !== undefined) {
      gallery.isActive = req.body.isActive === "true" || req.body.isActive === true;
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

// Toggle Gallery Item Status (Active / Inactive)
export const toggleGalleryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery photo not found",
      });
    }

    gallery.isActive = gallery.isActive === false ? true : false;

    await gallery.save();

    res.status(200).json({
      message: `Photo status updated to ${gallery.isActive ? "Active" : "Inactive"}`,
      gallery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery status",
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