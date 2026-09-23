import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    service: String,
    inquiryType: {
      type: String,
      enum: ["contact", "product"],
      default: "contact",
    },
    productTitle: String,
    productPrice: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
