import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import { authenticate } from "./middleware/auth.js";
import { authorize } from "./middleware/role.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import storeRoutes from "./modules/stores/store.routes.js";
import ratingRoutes from "./modules/ratings/rating.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/stores", storeRoutes);
app.use("/api", ratingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

app.get(
  "/api/admin-test",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      message: "You are an admin",
    });
  }
);

export default app;