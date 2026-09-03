import { Router } from "express";
import { login, signup } from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

const router = Router();

router.post("/signup", (req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;
  signup(req, res, next);
});

router.post("/login", (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;
  login(req, res, next);
});

export default router;