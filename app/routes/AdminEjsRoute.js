
const express = require("express");

const AdminEjsController = require("../controllers/AdminEjsController");

const AdminAuthCheck = require("../middleware/AdminAuthCheck");

const router = express.Router();

// login view & create
router.get("/admin/login", AdminEjsController.loginPage);

router.post("/admin/login/create", AdminEjsController.adminLogin);

router.use(AdminAuthCheck);

// get admin profile
router.get("/admin/profile", AdminEjsController.AdminCheckAuth, AdminEjsController.adminProfile);

// get admin dashboard
router.get("/admin/dashboard", AdminEjsController.AdminCheckAuth, AdminEjsController.adminDashboard);

// record page
router.get(
  "/record/add",
  AdminEjsController.addAdminRecord,
);

// create record
router.post(
  "/create/record",
  AdminEjsController.createAdminRecord,
);

// get record
router.get(
  "/edit/record/:id",
  AdminEjsController.editAdminRecord,
);

// update record
router.post(
  "/update/record/:id",
  AdminEjsController.updateAdminRecord,
);

// delete record
router.get(
  "/delete/admin_record/:id",
  AdminEjsController.deleteAdminRecord,
);

// logout
router.get("/admin/logout", AdminEjsController.logoutAdmin);

module.exports = router;