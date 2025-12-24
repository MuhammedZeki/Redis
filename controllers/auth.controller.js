import bcrypt from 'bcrypt'
import { User } from "../models/User.model.js";
import { consumeResetToken, createResetToken } from '../services/passwordReset.service.js';
import { invalidateAllSession } from '../services/session.service.js';



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
    await redisClient.sAdd(`user:sessions:${user._id}`, req.session.id);

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

    req.session.regenerate(async (err) => {
        if (err) {
            return res.status(500).json({ message: "Oturum yenilenemedi" });
        }

        req.session.userId = user._id;
        req.session.role = user.role;

        user.lastLoginAt = new Date();
        await user.save({ validateBeforeSave: false });

        await redisClient.sAdd(
            `user:sessions:${user._id}`,
            req.session.id //o anki kullanmış oldugun aygıtın bilgisi buna kendisi ulaşıyor  ali->tel,ali->pc (prefix:sess değeri o angi aygıtın kimşiğinidir)
        );

        return res.status(200).json({
            message: "Giriş başarılı",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    });
};

export const logout = async (req, res) => {
    const userId = req.session.userId;
    const sessionId = req.session.id;

    req.session.destroy(async (err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });


        //o anki aygıttaki kimliğide sil diyoruz 
        if (userId) {
            await redisClient.sRem(`user:sessions:${userId}`, sessionId);
        }

        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
    });
};


export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({
            message: "If the email exists, a reset link has been sent",
        });
    }

    const token = await createResetToken(user._id);

    console.log(`RESET LINK: http://localhost:3000/reset-password?token=${token}`);

    res.json({
        message: "If the email exists, a reset link has been sent",
    });
};


export const validateResetToken = async (req, res) => {
    const { token } = req.query;

    const exists = await redisClient.exists(`reset:${token}`);
    if (!exists) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Token valid" });
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    const userId = await consumeResetToken(token);
    if (!userId) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hash = await bcrypt.hash(newPassword, 12);

    await User.findByIdAndUpdate(
        userId,
        { password: hash },
        { validateBeforeSave: false }
    );

    await invalidateAllSession(userId)

    res.json({ message: "Password updated successfully" });
};


export const getMe = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ user: null });
    }

    const user = await User.findById(req.session.userId).select("-password");

    if (!user || !user.isActive) {
        return res.status(401).json({ message: "Geçersiz oturum" });
    }

    return res.json({ user });
}