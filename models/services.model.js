import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
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

    badge: {
      type: String,
      default: null,
      trim: true,
    },

    tagline: {
      type: String,
      default: null,
      trim: true,
    },

    desc: {
      type: String,
      default: null,
      trim: true,
    },

    longDesc: {
      type: String,
      default: null,
    },

    price: {
      type: String,
      default: null,
      trim: true,
    },

    duration: {
      type: String,
      default: null,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    icon: {
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

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],

    process: [
      {
        step: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          required: true,
          trim: true,
        },

        desc: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Services = mongoose.model("Services", servicesSchema);

export default Services;