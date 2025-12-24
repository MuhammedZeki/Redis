import { User } from "../models/User.model.js";

export const requiredAuth = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Oturum bulunamadı, lütfen giriş yapın." });
    }

    try {
        // 2. Kullanıcıyı DB'den bul (Opsiyonel ama güvenlik için iyidir)
        // Sadece ID ve Role çekerek veritabanını yormayız
        const user = await User.findById(req.session.userId).select("role isActive");

        if (!user) {
            return res.status(401).json({ message: "Kullanıcı bulunamadı." });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Hesabınız askıya alınmıştır." });
        }

        // Böylece her yerde req.user.id diyerek kullanabilirsin
        req.user = user;

        next();
    } catch (error) {
        return res.status(500).json({ message: "Yetkilendirme hatası" });
    }
};


// {
//   _id: "658a...", // Otomatik gelir
//   id: "658a...",  // Mongoose sayesinde sanal olarak gelir
//   role: "admin",
//   isActive: true
// }