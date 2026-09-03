import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { getStores } from "./store.controller.js";

const router = Router();

router.get("/", authenticate, getStores);

export default router;