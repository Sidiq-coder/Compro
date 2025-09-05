import { Router } from "express";
import { DepartmentController } from "../controllers/departement.js";
import { authenticate } from "../middlewares/auth.js";
import { requireMinimumRole } from "../middlewares/role.js";

const router = Router();

// GET routes - tidak memerlukan autentikasi untuk public access
router.get("/stats", authenticate, DepartmentController.getStats);
router.get("/", DepartmentController.getAll);
router.get("/:id", DepartmentController.getById);

// POST, PUT, DELETE routes - memerlukan autentikasi dan role minimum ketua_departemen
router.post("/", 
  authenticate, 
  requireMinimumRole('ketua_departemen'), 
  DepartmentController.create
);

router.put("/:id", 
  authenticate, 
  requireMinimumRole('ketua_departemen'), 
  DepartmentController.update
);

router.delete("/:id", 
  authenticate, 
  requireMinimumRole('ketua_departemen'), 
  DepartmentController.remove
);

export default router;
