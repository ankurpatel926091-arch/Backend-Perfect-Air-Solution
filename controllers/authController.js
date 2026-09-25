import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const cleanEmail = email?.trim().toLowerCase();
  const admin = await Admin.findOne({ email: cleanEmail });

  if (!admin) {
    return res.status(401).json({ message: "Admin not found!" });
  }

  const match = await bcrypt.compare(password, admin.password);
  console.log("Password match:", match);

  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  
  const adminRes = await Admin.findOne({ email: cleanEmail }).select("-password");

  const token = jwt.sign( { id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" } );

  res.json({
    message: "Login successful",
    admin: adminRes,
    user: adminRes.email,
    token
  });
};