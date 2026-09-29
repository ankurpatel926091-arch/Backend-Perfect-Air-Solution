import Brand from "../models/brand.model.js";
import cloudinary from "../config/cloudinary.js";


// ===============================
// CREATE BRAND
// ===============================
export const createBrand = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    console.log(req.file);
    console.log(req.body);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Brand logo is required",
      });
    }

    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: "Brand already exists",
      });
    }
    console.log("--->>>>> upload krne se pahle ka code ");

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "perfect-air-solution/gallery",
    });

    console.log("--->>>>> upload hone ke bad ka code ");

    const brand = new Brand({
      name,
      logo: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      isActive: isActive ?? true,
    });

    const savedBrand = await brand.save();

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: savedBrand,
    });
  } catch (error) {
    console.error("Create Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create brand",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL BRANDS
// SEARCH + STATUS + PAGINATION
// ===============================
export const getBrands = async (req, res) => {
  try {
    const {
      name,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query = {};

    const searchVal = (req.query.search || req.query.name || "").trim();
    if (searchVal) {
      const safeTerm = searchVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = {
        $regex: safeTerm,
        $options: "i",
      };
    }

    // Active / Inactive filter
    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    // Total filtered records and overall counts
    const [totalBrands, totalCount, activeCount, brands] = await Promise.all([
      Brand.countDocuments(query),
      Brand.countDocuments(),
      Brand.countDocuments({ isActive: true }),
      Brand.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
    ]);

    const inactiveCount = totalCount - activeCount;

    return res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      total: totalBrands,
      totalCount,
      activeCount,
      inactiveCount,
      page: Number(page),
      limit: Number(limit),
      foundRecords: brands.length,
      data: brands,
    });

  } catch (error) {
    console.error("Get Brands Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch brands",
      error: error.message,
    });
  }
};

// ===============================
// GET ACTIVE BRANDS
// ===============================
export const getActiveBrands = async (req, res) => {
  try {
    const brands = await Brand.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    console.error("Get Active Brands Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active brands",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE BRAND
// ===============================
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (name !== undefined) {
      brand.name = name;
    }

    if (isActive !== undefined) {
      brand.isActive = isActive;
    }

    // Update logo if new image is uploaded
    if (req.file) {
  // Delete old logo from Cloudinary
  if (brand.logo?.public_id) {
    await cloudinary.uploader.destroy(brand.logo.public_id);
  }

  // Upload new logo
  const uploadResult = await cloudinary.uploader.upload(req.file.path, {
    folder: "perfect-air-solution/brands",
  });

  // Save new logo details
  brand.logo = {
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
  };
}

    const updatedBrand = await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Update Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update brand",
      error: error.message,
    });
  }
};

// ===============================
// DELETE BRAND
// ===============================
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (brand.logo?.public_id) {
      await cloudinary.uploader.destroy(brand.logo.public_id);
    }

    await Brand.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Delete Brand Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete brand",
      error: error.message,
    });
  }
};


//patch

export const toggleBrandStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Toggle status
    brand.isActive = !brand.isActive;

    const updatedBrand = await brand.save();

    return res.status(200).json({
      success: true,
      message: `Brand status is  ${
        updatedBrand.isActive ? "ture " : "false"
      }`,
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Toggle Brand Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle brand status",
      error: error.message,
    });
  }
};