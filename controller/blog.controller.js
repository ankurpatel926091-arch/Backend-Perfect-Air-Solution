import Blog from '../model/blog.model.js';

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    // Accept category, title, content, and image
    const { category, title, content } = req.body;
    let image = req.file ? req.file.path : undefined;
    if (!category || !title || !content || !image) {
      return res.status(400).json({ message: 'Category, title, content, and image are required.' });
    }
    let parsedContent = content;
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        parsedContent = [content];
      }
    }
    const newBlog = new Blog({ category, title, content: parsedContent, image });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    // Accept category, title, content, and optionally image
    const { category, title, content } = req.body;
    let image = req.file ? req.file.path : undefined;
    if (!category || !title || !content) {
      return res.status(400).json({ message: 'Category, title, and content are required.' });
    }
    let parsedContent = content;
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        parsedContent = [content];
      }
    }
    const updateFields = { category, title, content: parsedContent };
    if (image) updateFields.image = image;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blog (Admin only)
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
