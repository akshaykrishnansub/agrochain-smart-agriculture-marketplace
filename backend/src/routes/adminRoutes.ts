import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/rbac.middleware.js";
import { adminDeleteProductController, adminDeleteUserController, adminUpdateOrderStatusController, adminUpdateUserRoleController, getAdminDashboard, getAllCertificationsController, getAllOrdersController, getAllProductsController, getAllUsersController, reviewCertificationController } from "../controllers/adminController.js";


const router=Router();

router.get("/dashboard",authenticateToken,checkRole("admin"),getAdminDashboard);
router.get("/users",authenticateToken,checkRole("admin"),getAllUsersController);
router.get("/products",authenticateToken,checkRole("admin"),getAllProductsController)
router.get("/orders",authenticateToken,checkRole("admin"),getAllOrdersController);
router.get("/certifications",authenticateToken,checkRole("admin"),getAllCertificationsController);
router.put("/certifications/:id/review",authenticateToken,checkRole("admin"),reviewCertificationController);
router.put("/users/:id/role",authenticateToken,checkRole("admin"),adminUpdateUserRoleController);
router.delete("/products/:id",authenticateToken,checkRole("admin"),adminDeleteProductController);
router.delete("/users/:id",authenticateToken,checkRole("admin"),adminDeleteUserController);
router.put("/orders/:id/status",authenticateToken,checkRole("admin"),adminUpdateOrderStatusController);

export default router;