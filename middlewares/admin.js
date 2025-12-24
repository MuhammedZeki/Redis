export const requiredAdmin = (req, res, next) => {
    if (req.session.role === "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}