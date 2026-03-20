const User = require("../models/user");

const Record = require("../models/record");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

class EmployeeEjsController {

  async EmployeeCheckAuth(req, res, next) {
    
    try {

      if (req.employee) {

        next();

      } else {
        res.redirect("/login/view");
      }
    } catch (error) {
      req.flash("error", error.message);
    }
  }

  // Register page
  async registerPage(req, res) {
    res.render("register", {
      title: "Register Page",
    });
  }

  // Login page
  async loginPage(req, res) {
    res.render("login", {
      title: "Login Page",
    });
  }

  async registerUser(req, res) {

    try {

      const { name, email, phone, password, is_admin } = req.body;

      //validate all fields
      if (!name || !email || !phone || !password ||!is_admin) {

        req.flash("error", "All fields are required");

        return res.redirect("/register/view");
      }


      const existUser = await User.findOne({ email });

      if (existUser) {
        return res.render("register", {
          title: "Register Page",
          message: "User already exists",
        });
      }

      //bcrypt function
      const salt = await bcrypt.genSalt(6);
      const hashedpassword = await bcrypt.hash(password, salt);

      const userdata = new User({
        name,
        email,
        phone,
        password: hashedpassword,
        is_admin
      });

      const result = await userdata.save();

      if (result) {
        req.flash("success", "Register done successfully");

        return res.redirect("/login/view");
      } else {
        req.flash("failed", "register failed");

        return res.redirect("/register/view");
      }
    } catch (error) {
      req.flash("error", error.message);

      return res.redirect("/register/view");
    }
  }

  // create login
  async loginUser(req, res) {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        req.flash("error", "Email & Passwords are required");

        return res.redirect("/login/view");
      }

      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (
        user &&
        user.is_admin === "employee" &&
        (await bcrypt.compare(password, user.password))
      ) {
        // Create token
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET_KEY || "secret",
          {
            expiresIn: "1d",
          },
        );

        if (token) {
          res.cookie("token", token);

          return res.redirect("/profile");
        } else {
          req.flash("login failed");
        }
      }

      return res.redirect("/login/view");
    } catch (error) {
      req.flash("error", error.message);
    }
  }

  //User profile
  async userProfile(req, res) {

    try {

      const user = await User.findById(req.employee._id);

      if (!user) {
        return res.render("profile", {
          title: "Profile Not Found",
          data: null,
        });
      }

      res.render("profile", {
        title: "Employee Profile Page",
        data: user,
      });

    } catch (error) {

       req.flash(error, "Error loading profile");
    }
  }

  // dashboard page
  async dashboard(req, res) {
    try {
      const data = await Record.find();

      res.render("dashboard", {
        title: "Employee Dashboard Page",
        data: data,
      });
    } catch (error) {
      req.flash("error", "Error loading dashboard");
      res.status(500).send("Error loading dashboard");
    }
  }

  //add employee page
  async addRecord(req, res) {
    res.render("add_record", {
      title: "Record Create Page",
    });
  }

  //create record
  async createRecord(req, res) {
    try {
      const { title, description } = req.body;

      //validate all fields
      if (!title || !description) {
        return res.redirect("/add_record");
      }

      const existPost = await Record.findOne({ title });

      if (existPost) {
        return res.redirect("/add_record");
      }

      const postdata = new Record({
        title,
        description,
      });

      const data = await postdata.save();

      if (data) {
        res.redirect("/dashboard");
      } else {
        res.redirect("/add_record");
      }
    } catch (error) {
      console.log("Error storing employee:", error);

      return res.status(500).send("Something went wrong");
    }
  }

  // logout user
  async logoutUser(req, res) {
    try {
      // clear cookie
      res.clearCookie("token");

      return res.redirect("/login/view");
    } catch (error) {
      req.flash("error", error.message);
    }
  }
}


module.exports = new EmployeeEjsController();