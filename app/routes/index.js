
const express = require("express");

const router = express.Router();

const EmployeeEjsRoute = require("./EmployeeEjsRoute");

const ManagerEjsRoute = require("./ManagerEjsRoute");

const AdminEjsRoute = require("./AdminEjsRoute");



router.use(EmployeeEjsRoute);

router.use(ManagerEjsRoute);

router.use(AdminEjsRoute);

module.exports = router;