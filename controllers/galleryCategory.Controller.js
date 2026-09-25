import GalleryCategory from "../models/galleryCategory.model.js";

export const createGalleryCategory = async (req, res) => {
  try {
    const { title, isActive } = req.body;

    const galleryCategory = await GalleryCategory.create({
      title,
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
    const galleryCategories = await GalleryCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Gallery categories fetched successfully",
      total: galleryCategories.length,
      galleryCategories,
    });
  } catch (error) {
    res.status(500).json({
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

    const galleryCategory = await GalleryCategory.findById(id);
    if (!galleryCategory) {
      return res.status(400).json({ message: "Gallery category not found!" });
    }

    galleryCategory.title = title;
    await galleryCategory.save();

    res.status(200).json({
      message: "Gallery category updated successfully",
      galleryCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
