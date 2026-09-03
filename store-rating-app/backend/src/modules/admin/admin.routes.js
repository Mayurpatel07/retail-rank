import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { authorize } from "../../middleware/role.js";
import {
  createStore,
  createUser,
  getDashboard,
  getStores,
  getUserById,
  getUsers,
} from "./admin.controller.js";
import {
  createStoreSchema,
  createUserSchema,
} from "./admin.validation.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/stores", getStores);
router.get("/users/:id", getUserById);

router.post("/users", (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;
  createUser(req, res, next);
});

router.post("/stores", (req, res, next) => {
  const result = createStoreSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;
  createStore(req, res, next);
});

export default router;