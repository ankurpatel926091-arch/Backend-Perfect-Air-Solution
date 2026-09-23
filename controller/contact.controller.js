import Contact from "../model/contact.model.js";
import sendEmail from "../utils/sendEmail.js"; 

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, service, inquiryType, productTitle, productPrice, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      service,
      inquiryType: inquiryType || "contact",
      productTitle,
      productPrice,
      message,
    });

    await sendEmail(contact);

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
