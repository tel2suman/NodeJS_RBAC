
const jwt = require("jsonwebtoken");

const AuthCheck = (req, res, next) => {

  if (req.cookies && req.cookies.token) {

    jwt.verify(

      req.cookies.token, process.env.JWT_SECRET_KEY || "secret",

      (err, data) => {

        req.employee = data;

        req.flash("employee found", req.employee);

        return next();
      },
    );
    
  } else {

    return next();
  }
};

module.exports = AuthCheck;