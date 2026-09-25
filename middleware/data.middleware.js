export const verify = (req, res, next) => {
    try {
        let a = 2
        if(a == 5){
            return res.status(401).json({ message: "Unauthorized" });
        }
        next()
    } catch (error) {
        console.error("Error verifying data:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}