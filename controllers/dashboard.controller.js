import Blog from "../models/blog.model.js";
import Brand from "../models/brand.model.js";
import Gallery from "../models/gallery.model.js";
import Contact from "../models/contact.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [blogsCount, galleryCount, brandsCount, contactsCount, recentContacts] =
      await Promise.all([
        Blog.countDocuments(),
        Gallery.countDocuments(),
        Brand.countDocuments(),
        Contact.countDocuments(),
        Contact.find().sort({ createdAt: -1 }).limit(5),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        blogsCount,
        galleryCount,
        brandsCount,
        contactsCount,
      },
      recentContacts,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
