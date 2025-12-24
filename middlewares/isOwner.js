import { Product } from "../models/Product.model.js";

export const isProductOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Ürün bulunamadı." });
        }

        // Admin ise her zaman geçsin, değilse sahibi mi diye bak
        const isAdmin = req.user.role === "admin";
        const isOwner = product.owner.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
        }

        req.product = product;

        next();
    } catch (error) {
        res.status(500).json({ message: "Yetki kontrolü sırasında hata oluştu." });
    }
};


// { req.product
//     _id: 456465,
//     id: 456456, // Mongoose virtuals
//     price: 120,
//     name: "deneme",
//     owner: "user_id_burada", // Bunu da içerir!
//     save: function() { ... } // Gizli Mongoose fonksiyonları da içindedir
// }