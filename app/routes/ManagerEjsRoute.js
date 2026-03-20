const express = require("express");

const ManagerEjsController = require("../controllers/ManagerEjsControler");

const ManagerAuthCheck = require("../middleware/ManagerAuthCheck");

const router = express.Router();


// login view & create
router.get("/manager/login", ManagerEjsController.loginPage);

router.post("/manager/login/create", ManagerEjsController.managerLogin);

router.use(ManagerAuthCheck);

// get user profile
router.get("/manager/profile", ManagerEjsController.ManagerCheckAuth, ManagerEjsController.managerProfile);

// user dashboard
router.get("/manager/dashboard", ManagerEjsController.ManagerCheckAuth, ManagerEjsController.managerDashboard);

// record page
router.get(
  "/record/add",
  ManagerEjsController.addManagerRecord,
);

// create record
router.post(
  "/create/record",
  ManagerEjsController.createManagerRecord,
);

// get record
router.get(
  "/edit/record/:id",
  ManagerEjsController.editManagerRecord,
);

// update record
router.post(
  "/update/record/:id",
  ManagerEjsController.updateManagerRecord,
);

// delete record
router.get(
  "/delete/record/:id",
  ManagerEjsController.deleteManagerRecord,
);

// logout
router.get("/manager/logout", ManagerEjsController.managerLogout);



module.exports = router;