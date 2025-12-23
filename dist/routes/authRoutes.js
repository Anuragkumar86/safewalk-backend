import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import { googleSync, login, register } from "../controllers/authControllers.js";
const router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google-sync", googleSync);
export default router;
//# sourceMappingURL=authRoutes.js.map