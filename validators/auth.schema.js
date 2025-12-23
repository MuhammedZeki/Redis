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
