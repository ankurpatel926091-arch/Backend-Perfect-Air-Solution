import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
export const verifyAdmin = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ message: "Token missing !" });
        }

        token = token.replace(/^["']+|["']+$/g, "").trim();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(401).json({ message: "Admin not found!" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error("Error verifying admin:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}