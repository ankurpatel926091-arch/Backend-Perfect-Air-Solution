import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById, 
  deleteBooking,
} from "../controller/booking.controller.js";

const router = express.Router();

// CREATE
router.post("/", createBooking);

// READ ALL
router.get("/", getBookings);

// READ BY ID 
router.get("/:id", getBookingById);

// DELETE
router.delete("/:id", deleteBooking);

export default router;