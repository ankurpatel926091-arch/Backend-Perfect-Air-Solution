import Contact from "../models/contact.js";

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

    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getContacts = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;

    let skip = (page - 1) * limit;

    let contacts;
    let totalContacts = await Contact.find().countDocuments();

    if (name) {
      contacts = await Contact.find({
        name: { $regex: name, $options: "i" }
      }).sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    } else {
      contacts = await Contact.find().sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    }

    res.status(200).json({
      message: "Contacts fetched successfully",
      total: totalContacts,
      page,
      limit,
      foundRecords : contacts.length,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};
