import z from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Geçerli bir mail giriniz!"),
        password: z.string().min(8, "Şifre en az 8 karakter"),
        name: z.string().min(2).optional()
    })
})

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    })
});

export const resetTokenQuerySchema = z.object({
    token: z
        .string()
        .min(20, "Invalid token")
        .max(128, "Invalid token"),
});

export const resetPasswordBodySchema = z.object({
    token: z.string().min(20),
    newPassword: z
        .string()
        .min(8, "Password too short")
        .regex(/[A-Z]/, "Must contain uppercase letter")
        .regex(/[0-9]/, "Must contain number"),
});
