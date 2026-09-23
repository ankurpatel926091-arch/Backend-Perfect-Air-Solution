import Order from "../model/order.model.js";
import { sendOrderEmail } from "../services/mail.service.js";
export const createOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      address,
      city,
      state,
      pinCode,
      product,
      quantity,
      amount,
    } = req.body;

    if (!fullName || !email || !mobile || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      customer: { fullName, email, mobile, address, city, state, pinCode },
      product,
      quantity,
      amount,
    });

    await newOrder.save();

    // ✅ SEND EMAIL
    await sendOrderEmail(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed & email sent",
      order: newOrder,
    });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};