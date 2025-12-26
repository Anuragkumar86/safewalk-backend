import { Router } from "express";

import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import { forgotPassword, googleSync, login, register, resetPassword } from "../controllers/authControllers.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google-sync", googleSync);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
