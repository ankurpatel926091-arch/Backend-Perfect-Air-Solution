import Contact from "../models/contact.js";
import { sendContactInquiryEmail } from "../config/nodemailer.js";

export const createContact = async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const contact = await Contact.create({
      name,
      phone,
      email,
      service,
      message,
    });

    // Send email notification via Nodemailer asynchronously
    sendContactInquiryEmail({ name, phone, email, service, message }).catch((err) => {
      console.error("Nodemailer Error sending contact inquiry email:", err.message);
    });

    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getContacts = async (req, res) => {
  try {
    const { name, search, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const rawTerm = (search || name || "").trim();
    const query = {};
    if (rawTerm) {
      const safeTerm = escapeRegex(rawTerm);
      query.$or = [
        { name: { $regex: safeTerm, $options: "i" } },
        { email: { $regex: safeTerm, $options: "i" } },
        { phone: { $regex: safeTerm, $options: "i" } },
        { service: { $regex: safeTerm, $options: "i" } },
        { message: { $regex: safeTerm, $options: "i" } },
      ];
    }

    const totalContacts = await Contact.countDocuments(query);
    const globalTotal = await Contact.countDocuments();
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      message: "Contacts fetched successfully",
      total: totalContacts,
      globalTotal,
      page: pageNum,
      limit: limitNum,
      foundRecords: contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};


