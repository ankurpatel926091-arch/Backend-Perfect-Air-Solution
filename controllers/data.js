export const data = (req, res) => {
    try {
        // Your data retrieval logic here
        // res.json({ message: "Data retrieved successfully" });
        const admin = req.admin;
        // res.json({ message: "Data retrieved successfully", admin: admin });
        // console.log("Admin data:", admin._id);
        // res.json({ message: "Data retrieved successfully", admin: admin });
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}