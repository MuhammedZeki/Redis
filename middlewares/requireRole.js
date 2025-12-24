export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user bilgisini bir önceki middleware (requiredAuth) doldurmuştu
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Bu işlemi yapmak için yetkiniz bulunmuyor."
            });
        }
        next();
    };
};