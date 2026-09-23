import Booking from "../model/booking.model.js";
import { sendBookingEmail } from "../services/mail.service.js";

// ✅ CREATE
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, service } = req.body;

    if (!name || !email || !phone || !service) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new Booking({ name, email, phone, service });
    await booking.save();
    await sendBookingEmail(booking);

    res.status(201).json({
      success: true,
      message: "Booking created & emails sent",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ (GET ALL BOOKINGS)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET BOOKING BY ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
