import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User modeline referans veriyoruz
        required: true
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
