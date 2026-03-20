const User = require("../models/user");

const Record = require("../models/record");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

class ManagerEjsController {

  async ManagerCheckAuth(req, res, next) {
    try {
      if (req.manager) {
        next();
      } else {
        res.redirect("/manager/login");
      }
    } catch (error) {
      req.flash(error);
    }
  }

  loginPage(req, res) {
    res.render("manager/manager_login", {
      title: "Manager Login Page",
    });
  }

  // create manger login
  async managerLogin(req, res) {
    try {
      console.log("BODY:", req.body);
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!email || !password) {
        console.log("All input is required");

        return res.redirect("/manager/login");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      console.log("USER:", user);

      if (
        user &&
        user.is_admin === "manager" &&
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
          res.cookie("managertoken", token);

          return res.redirect("/manager/profile");
        } else {
          req.flash("login failed");
          return res.redirect("/manager/login");
        }
      }

      req.flash("error", "Invalid email or password");

      return res.redirect("/manager/login");

    } catch (error) {

      console.error(error);

      req.flash("error", "Something went wrong");

      return res.redirect("/manager/login");
    }
  }

  //manager profile
  async managerProfile(req, res) {
    try {
      const user = await User.findById(req.manager._id);

      if (!user) {
        return res.render("manager/manager_profile", {
          title: "Profile Not Found",
          data: null,
        });
      }

      res.render("manager/manager_profile", {
        title: "Manager Profile Page",
        data: user,
      });
    } catch (error) {
      req.flash(error, "Error loading profile");
    }
  }

  // dashboard page
  async managerDashboard(req, res) {
    try {
      const data = await Record.find();

      res.render("manager/manager_dashboard", {
        title: "Manager Dashboard Page",
        data: data,
      });
    } catch (error) {
      req.flash("error", "Error loading dashboard");
      res.status(500).send("Error loading dashboard");
    }
  }

  //add employee page
  async addManagerRecord(req, res) {
    res.render("add_record", {
      title: "Record Create Page",
    });
  }

  //create record
  async createManagerRecord(req, res) {
    try {
      const { title, description } = req.body;

      //validate all fields
      if (!title || !description) {
        return res.redirect("/record/add");
      }

      const existPost = await Record.findOne({ title });

      if (existPost) {
        return res.redirect("/record/add");
      }

      const postdata = new Record({
        title,
        description,
      });

      const data = await postdata.save();

      if (data) {

        res.redirect("/manager/dashboard");

      } else {

        res.redirect("/record/add");
      }
    } catch (error) {

      console.log("Error storing employee:", error);

      return res.status(500).send("Something went wrong");
    }
  }

  //edit record
  async editManagerRecord(req, res) {
    try {
      const id = req.params.id;

      const edit = await Record.findById(id);

      res.render("edit_record", {
        title: "Edit Record Page",
        data: edit,
      });
    } catch (error) {
      req.flash(error, "Error in edit record");
    }
  }

  //update student
  async updateManagerRecord(req, res) {
    try {
      const id = req.params.id;

      const edit = await Record.findByIdAndUpdate(id, req.body, { new: true });

      res.redirect("/manager/dashboard");
    } catch (error) {
      req.flash(error, "Error in edit record");
    }
  }

  // hard delete post
  async deleteManagerRecord(req, res) {

    try {

      const id = req.params.id;

      // Check if user exists and is admin
      if (!req.user || req.user.is_admin !== "admin") {
          return res.status(403).send("Your Access denied");
      }

      if (!id) {
        return res.redirect("/manager/dashboard");
      }

      const data = await Record.findByIdAndDelete(id);

      if (!data) {
        return res.redirect("/manager/dashboard");
      }

      return res.redirect("/manager/dashboard");

    } catch (error) {

      console.error(error);

      return res.status(500).send("Something went wrong");

    }
  }

  managerLogout(req, res) {
    res.clearCookie("managertoken");
    return res.redirect("/manager/login");
  }
}

module.exports = new ManagerEjsController();