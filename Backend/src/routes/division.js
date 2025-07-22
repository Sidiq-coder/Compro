import { Router } from "express";
import { DivisionController } from "../controllers/division.js";
import { authenticate } from "../middlewares/auth.js";
import { requireMinimumRole } from "../middlewares/role.js";

const router = Router();

// GET routes - tidak memerlukan autentikasi untuk public access
router.get("/", DivisionController.getAll);
router.get("/:id", DivisionController.getById);

// POST, PUT, DELETE routes - memerlukan autentikasi dan role minimum ketua_departemen
router.post("/", 
  authenticate, 
  requireMinimumRole('ketua_departemen'), 
  DivisionController.create
);

router.put("/:id", 
  authenticate, 
  requireMinimumRole('ketua_departemen'), 
  DivisionController.update
);

router.delete("/:id", 
  authenticate, 
  requireMinimumRole('ketua_departemen'), 
  DivisionController.remove
);

export default router;
