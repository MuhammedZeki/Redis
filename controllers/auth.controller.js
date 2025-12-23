import bcrypt from 'bcrypt'
import { User } from "../models/User.model.js";



export const register = async (req, res) => {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            message: "Bu email zaten kayıtlı",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
        name,
    });

    req.session.userId = user._id;
    req.session.role = user.role;

    return res.status(201).json({
        message: "Kayıt başarılı",
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Kullanıcıyı bul (password lazım olduğu için select +password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({
            message: "Email veya şifre hatalı",
        });
    }

    if (!user.isActive) {
        return res.status(403).json({
            message: "Hesap pasif",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            message: "Email veya şifre hatalı",
        });
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false }); //burda tekrar db validate yapma boşuna yorma

    return res.status(200).json({
        message: "Giriş başarılı",
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
};