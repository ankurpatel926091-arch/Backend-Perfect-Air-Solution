import Brand from '../model/brand.model.js';

// Get all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a brand
export const createBrand = async (req, res) => {
  try {
    const { name, brandName, tagline, overview, website, isActive } = req.body;
    let heroImage = req.body.heroImage || req.body.logo;
    if (req.file) {
      heroImage = req.file.path; // Cloudinary URL
    }

    const brandPayload = {
      name: name || brandName,
      brandName: brandName || name,
      tagline: tagline || overview,
      overview: overview || tagline,
      website,
      isActive: isActive !== undefined ? isActive : true,
      heroImage,
      logo: heroImage,
    };

    const newBrand = new Brand(brandPayload);
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a brand
export const updateBrand = async (req, res) => {
  try {
    const { name, brandName, tagline, overview, website, isActive } = req.body;
    const updateData = {};

    if (name || brandName) {
      updateData.name = name || brandName;
      updateData.brandName = brandName || name;
    }
    if (tagline !== undefined || overview !== undefined) {
      updateData.tagline = tagline || overview;
      updateData.overview = overview || tagline;
    }
    if (website !== undefined) updateData.website = website;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.file) {
      updateData.heroImage = req.file.path;
      updateData.logo = req.file.path;
    } else if (req.body.heroImage) {
      updateData.heroImage = req.body.heroImage;
      updateData.logo = req.body.heroImage;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updatedBrand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete brand (Admin only)
export const deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
