import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/rbac.middleware.js";
import { cancelOrderController, createOrderController, getOrdersController, updateOrderStatusController } from "../controllers/orderController.js";
import { cancelCheckoutController, createCheckoutSessionController } from "../controllers/paymentController.js";

const router=Router();

router.post("/",authenticateToken,checkRole("buyer"),createOrderController);
router.post("/checkout-session",authenticateToken,checkRole("buyer"),createCheckoutSessionController);
router.patch("/checkout/:orderId/cancel",authenticateToken,checkRole("buyer"),cancelCheckoutController);
router.put("/:id/status",authenticateToken,checkRole("farmer","supplier","admin"),updateOrderStatusController);
router.get("/",authenticateToken,getOrdersController);
router.patch("/:id/cancel",authenticateToken,checkRole("buyer"),cancelOrderController)

export default router;