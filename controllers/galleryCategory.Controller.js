import GalleryCategory from "../models/galleryCategory.model.js";

export const createGalleryCategory = async (req, res) => {
  try {
    const { title, isActive } = req.body;

    const trimmedTitle = (title || "").trim();
    if (!trimmedTitle) {
      return res.status(400).json({
        message: "Category title is required",
      });
    }

    const safeTitle = trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = await GalleryCategory.findOne({
      title: { $regex: `^${safeTitle}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        message: "Gallery category with this name already exists",
      });
    }

    const galleryCategory = await GalleryCategory.create({
      title: trimmedTitle,
      isActive,
    });

    res.status(201).json({
      message: "Gallery category created successfully",
      galleryCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create gallery category",
      error: error.message,
    });
  }
};

// galleryCategory get api
export const getGalleryCategories = async (req, res) => {
  try {
    const { name, status, page, limit } = req.query;

    const query = {};

    const searchVal = (req.query.search || req.query.name || "").trim();
    if (searchVal) {
      const safeTerm = searchVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.title = { $regex: safeTerm, $options: "i" };
    }

    if (status === "active") {
      query.isActive = { $ne: false };
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    const queryPromise = GalleryCategory.find(query).sort({ createdAt: -1 });

    if (page && limit) {
      const skip = (Number(page) - 1) * Number(limit);
      queryPromise.skip(skip).limit(Number(limit));
    }

    const [totalCategories, totalCount, activeCount, galleryCategories] = await Promise.all([
      GalleryCategory.countDocuments(query),
      GalleryCategory.countDocuments(),
      GalleryCategory.countDocuments({ isActive: { $ne: false } }),
      queryPromise,
    ]);

    const inactiveCount = totalCount - activeCount;

    res.status(200).json({
      success: true,
      message: "Gallery categories fetched successfully",
      total: totalCategories,
      totalCount,
      activeCount,
      inactiveCount,
      galleryCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery categories",
      error: error.message,
    });
  }
};

// delete api
export const deleteGalleryCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryCategory = await GalleryCategory.findByIdAndDelete(id);

    if (!galleryCategory) {
      return res.status(404).json({
        message: "Gallery category not found",
      });
    }

    res.status(200).json({
      message: "Gallery category deleted successfully",
      galleryCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gallery category",
      error: error.message,
    });
  }
};

// patch ki api
export const updateGalleryCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryCategory = await GalleryCategory.findById(id);

    if (!galleryCategory) {
      return res.status(404).json({
        message: "Gallery category not found",
      });
    }

    galleryCategory.isActive = !galleryCategory.isActive;

    await galleryCategory.save();

    res.status(200).json({
      message: "Gallery category status updated successfully",
      galleryCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery category status",
      error: error.message,
    });
  }
};

export const updateGalleryCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const trimmedTitle = (title || "").trim();
    if (!trimmedTitle) {
      return res.status(400).json({ message: "Category title is required" });
    }

    const galleryCategory = await GalleryCategory.findById(id);
    if (!galleryCategory) {
      return res.status(404).json({ message: "Gallery category not found!" });
    }

    const safeTitle = trimmedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = await GalleryCategory.findOne({
      _id: { $ne: id },
      title: { $regex: `^${safeTitle}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        message: "Gallery category with this name already exists",
      });
    }

    galleryCategory.title = trimmedTitle;
    await galleryCategory.save();

    res.status(200).json({
      message: "Gallery category updated successfully",
      galleryCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
