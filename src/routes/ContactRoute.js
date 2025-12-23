import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createEmergencyContactSchema } from "../validators/emergencyContact.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addContact, deleteContact, getAllContact, updateContact } from "../controllers/EmergencyContactController.js";
const router = Router();
router.post("/add", authMiddleware, validate(createEmergencyContactSchema), addContact);
router.get('/', authMiddleware, getAllContact);
router.put('/:id', authMiddleware, validate(createEmergencyContactSchema), updateContact);
router.delete('/:id', authMiddleware, deleteContact);
export default router;
//# sourceMappingURL=ContactRoute.js.map