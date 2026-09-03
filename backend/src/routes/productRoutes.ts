import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/rbac.middleware.js";
import { createProductController, deleteProductController, getAllProductsController, updateProductController } from "../controllers/productController.js";

const router=Router();

router.post("/",authenticateToken,checkRole("farmer","supplier"),createProductController);
router.put("/:id",authenticateToken,checkRole("farmer","supplier"),updateProductController);
router.get("/",getAllProductsController);
router.delete("/:id",authenticateToken,checkRole("farmer","supplier"),deleteProductController);

export default router;