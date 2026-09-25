import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
    },

    readTime: {
      type: String,
      default: null,
      trim: true,
    },

    date: {
      type: String,
      default: null,
      trim: true,
    },

    author: {
      type: String,
      default: null,
      trim: true,
    },

    image: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    content: {
  type: String,
  trim: true,
},


    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;