import Subscriber from "../model/subscriber.model.js";
import sendNewsletterEmail from "../utils/sendNewsletterEmail.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    // Save subscriber
    const subscriber = await Subscriber.create({ email });

    // Optional email notification
    await sendNewsletterEmail(email);

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};