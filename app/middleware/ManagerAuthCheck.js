
const jwt = require("jsonwebtoken");

const ManagerAuthCheck = (req, res, next) => {

  if (req.cookies && req.cookies.managertoken) {

    jwt.verify(
      req.cookies.managertoken,
      process.env.JWT_SECRET_KEY || "secret",

      (err, data) => {
        req.manager = data;

        req.flash("manager found", req.manager);

        return next();
      },
    );

  } else {

    return next();
  }
};

module.exports = ManagerAuthCheck;