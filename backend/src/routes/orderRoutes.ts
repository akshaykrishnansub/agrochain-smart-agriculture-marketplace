import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/rbac.middleware.js";
import { createOrderController, getOrdersController, updateOrderStatusController } from "../controllers/orderController.js";
import { createCheckoutSessionController } from "../controllers/paymentController.js";

const router=Router();

router.post("/",authenticateToken,checkRole("buyer"),createOrderController);
router.post("/checkout-session",authenticateToken,checkRole("buyer"),createCheckoutSessionController);
router.put("/:id/status",authenticateToken,checkRole("farmer","supplier","admin"),updateOrderStatusController);
router.get("/",authenticateToken,getOrdersController);

export default router;