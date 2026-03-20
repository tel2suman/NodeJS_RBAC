
const express = require("express");

const EmployeeEjsController = require("../controllers/EmployeeEjsController");

const EmployeeAuthCheck = require("../middleware/EmployeeAuthCheck");

const router = express.Router();

// register view & create
router.get("/register/view", EmployeeEjsController.registerPage);

router.post("/create/register", EmployeeEjsController.registerUser);

// login view & create
router.get("/login/view", EmployeeEjsController.loginPage);

router.post("/create/login", EmployeeEjsController.loginUser);


router.use(EmployeeAuthCheck);

// get user profile
router.get("/profile", EmployeeEjsController.EmployeeCheckAuth, EmployeeEjsController.userProfile);

// user dashboard
router.get("/dashboard", EmployeeEjsController.EmployeeCheckAuth, EmployeeEjsController.dashboard);

// record page
router.get(
  "/record/add",
  EmployeeEjsController.addRecord,
);

// create record
router.post(
  "/create/record",
  EmployeeEjsController.createRecord,
);

// user logout
router.get("/logout", EmployeeEjsController.logoutUser);


module.exports = router;