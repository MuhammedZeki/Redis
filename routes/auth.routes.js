import express from "express"
import { validate } from "../middlewares/validate.js"
import { loginSchema, registerSchema } from "../validators/auth.schema.js"
import { login, register } from "../controllers/auth.controller.js"
const router = express.Router()


router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)


export default router