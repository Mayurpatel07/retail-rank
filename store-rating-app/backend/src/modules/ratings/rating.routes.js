import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  createRating,
  updateRating,
} from "./rating.controller.js";
import { ratingSchema } from "./rating.validation.js";

const router = Router();

function validateRating(req, res, next) {
  const result = ratingSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  req.body = result.data;
  next();
}

router.post(
  "/stores/:storeId/rating",
  authenticate,
  validateRating,
  createRating
);

router.patch(
  "/stores/:storeId/rating",
  authenticate,
  validateRating,
  updateRating
);

export default router;