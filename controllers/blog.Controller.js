import Blog from "../models/blog.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";


// ==========================================
// CREATE BLOG
// POST /api/blogs
// ==========================================
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      readTime,
      date,
      author,
      tags,
      content,
      isActive,
    } = req.body;

    // Required fields
    if (!title || !excerpt) {
      return res.status(400).json({
        success: false,
        message: "Title and excerpt are required",
      });
    }

    // Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Check duplicate slug
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: "Blog with this title already exists",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "perfect-air-solution/blogs",
    });

    // Format default date if not provided
    const blogDate =
      date && date.trim()
        ? date.trim()
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

    // Create blog
    const blog = new Blog({
      slug,
      title,
      excerpt,
      readTime: (readTime && readTime.trim()) ? readTime.trim() : "5 min read",
      date: blogDate,
      author: (author && author.trim()) ? author.trim() : "Perfect Air Solution",

      image: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },

      tags: tags
        ? Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? (() => {
              try {
                const parsed = JSON.parse(tags);
                return Array.isArray(parsed) ? parsed : [tags];
              } catch {
                return tags.split(",").map((t) => t.trim()).filter(Boolean);
              }
            })()
          : []
        : [],

      content: content || "",

      isActive: isActive === "false" ? false : true,
    });

    const savedBlog = await blog.save();

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


// ==========================================
// GET ALL BLOGS
// GET /api/blogs
// ==========================================
// ==========================================
// GET ALL BLOGS
// GET /api/blogs?title=&status=&page=1&limit=10
// ==========================================
export const getBlogs = async (req, res) => {
  try {
    const {
      title,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // Search + status filter
    const query = {};

    // Search by title
    if (title) {
      query.title = {
        $regex: title,
        $options: "i",
      };
    }

    // Status filter
    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    // Total records after search/filter
    const filteredTotal = await Blog.countDocuments(query);

    // Overall counts
    const totalBlogs = await Blog.countDocuments();
    const activeBlogs = await Blog.countDocuments({
      isActive: true,
    });
    const inactiveBlogs = await Blog.countDocuments({
      isActive: false,
    });

    // Fetch paginated blogs
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",

      // Overall counts
      total: totalBlogs,
      active: activeBlogs,
      inactive: inactiveBlogs,

      // Filtered count for pagination
      filteredTotal,

      page: pageNumber,
      limit: limitNumber,
      foundRecords: blogs.length,

      data: blogs,
    });

  } catch (error) {
    console.error("Get Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};


// ==========================================
// GET ACTIVE BLOGS
// GET /api/blogs/active
// ==========================================
export const getActiveBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });

  } catch (error) {
    console.error("Get Active Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active blogs",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE BLOG
// GET /api/blogs/:id
// GET /api/blogs/:slug
// ==========================================
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    let blog;

    // If MongoDB ObjectId is provided
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findOne({
        _id: id,
        isActive: true,
      });
    }

    // Otherwise search by slug
    if (!blog) {
      blog = await Blog.findOne({
        slug: id,
        isActive: true,
      });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get Blog By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE BLOG
// PUT /api/blogs/:id
// ==========================================
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      excerpt,
      readTime,
      date,
      author,
      tags,
      content,
      isActive,
    } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // If title is updated, generate new slug
    if (title) {
      const newSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      // Check slug already exists for another blog
      const existingBlog = await Blog.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (existingBlog) {
        return res.status(409).json({
          success: false,
          message: "Another blog with this title already exists",
        });
      }

      blog.slug = newSlug;
      blog.title = title;
    }

    // Update other fields
    if (excerpt !== undefined) {
      blog.excerpt = excerpt;
    }

    if (readTime !== undefined) {
      blog.readTime = readTime;
    }

    if (date !== undefined && date !== null && date !== "") {
      blog.date = date;
    } else if (!blog.date) {
      blog.date = new Date(blog.createdAt || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    if (author !== undefined && author !== null && author !== "") {
      blog.author = author;
    } else if (!blog.author) {
      blog.author = "Perfect Air Solution";
    }

    if (tags !== undefined) {
      blog.tags = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(tags);
              return Array.isArray(parsed) ? parsed : [tags];
            } catch {
              return tags.split(",").map((t) => t.trim()).filter(Boolean);
            }
          })()
        : [];
    }

    if (content !== undefined) {
      blog.content = content;
    }

    if (isActive !== undefined) {
      blog.isActive = isActive === "false" ? false : true;
    }

    // Update image only if new image is provided
    if (req.file) {

      // Delete old Cloudinary image
      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(
          blog.image.public_id
        );
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "perfect-air-solution/blogs",
        }
      );

      blog.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    const updatedBlog = await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });

  } catch (error) {
    console.error("Update Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE BLOG
// DELETE /api/blogs/:id
// ==========================================
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Delete image from Cloudinary
    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(
        blog.image.public_id
      );
    }

    // Delete blog from MongoDB
    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    console.error("Delete Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};


// ==========================================
// TOGGLE BLOG STATUS
// PATCH /api/blogs/status/:id
// ==========================================
export const toggleBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Toggle true / false safely
    const currentStatus = blog.isActive !== false;
    blog.isActive = !currentStatus;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog status updated successfully",
      data: blog,
    });

  } catch (error) {
    console.error("Toggle Blog Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blog status",
      error: error.message,
    });
  }
};