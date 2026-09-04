import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { authorize } from "../../middleware/role.js";
import { getDashboard } from "./owner.controller.js";

const router = Router();

router.use(authenticate, authorize("STORE_OWNER"));

router.get("/dashboard", getDashboard);

export default router;