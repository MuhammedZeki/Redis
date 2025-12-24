import express from "express"
import { validate, validateBody, validateQuery } from "../middlewares/validates.js"
import { loginSchema, registerSchema, resetPasswordBodySchema, resetTokenQuerySchema } from "../validators/auth.schema.js"
import { forgotPassword, getMe, login, logout, register, resetPassword, validateResetToken } from "../controllers/auth.controller.js"
import { requiredAuth } from "../middlewares/auth.js"
import { forgotPasswordLimit, getMeLimit, loginLimit, registerLimit } from "../middlewares/rateLimitEvent.js"


const router = express.Router()


router.post("/register", registerLimit, validate(registerSchema), register);
router.post("/login", loginLimit, validate(loginSchema), login);
router.post("/logout", requiredAuth, logout);

router.post("/forgot-password", forgotPasswordLimit, forgotPassword);

router.get("/reset-password", validateQuery(resetTokenQuerySchema), validateResetToken);
router.post("/reset-password", loginLimit, validateBody(resetPasswordBodySchema), resetPassword);

router.get("/me", getMeLimit, getMe);

export default router