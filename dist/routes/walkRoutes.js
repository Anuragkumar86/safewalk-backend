import { Router } from "express";
import { getPublicSession, getWalkHistory, markSafe, startWalk } from "../controllers/walkController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/start-walk", authMiddleware, startWalk);
router.post("/mark-safe", authMiddleware, markSafe);
router.get("/history", authMiddleware, getWalkHistory);
router.get("/public/:sessionId", getPublicSession);
export default router;
//# sourceMappingURL=walkRoutes.js.map