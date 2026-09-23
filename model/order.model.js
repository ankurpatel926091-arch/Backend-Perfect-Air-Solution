import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      address: String,
      city: String,
      state: String,
      pinCode: String,
    },
    product: {
      title: String,
      model: String,
      brand: String,
      imageUrl: String,
      price: Number,
    },
    quantity: { type: Number, default: 1 },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);