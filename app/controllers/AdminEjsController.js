const User = require("../models/user");

const Record = require("../models/record");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

class AdminEjsController {
  async AdminCheckAuth(req, res, next) {
    try {
      if (req.admin) {
        next();
      } else {
        res.redirect("/admin/login");
      }
    } catch (error) {
      req.flash(error);
    }
  }

  loginPage(req, res) {
    res.render("admin/admin_login", {
      title: "Admin Login Page",
    });
  }

  // create manger login
  async adminLogin(req, res) {
    try {
      console.log("BODY:", req.body);
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!email || !password) {
        console.log("All input is required");

        return res.redirect("/admin/login");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      console.log("USER:", user);

      if (
        user &&
        user.is_admin === "admin" &&
        (await bcrypt.compare(password, user.password))
      ) {
        // Create token
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.is_admin,
          },
          process.env.JWT_SECRET_KEY || "secret",
          {
            expiresIn: "1d",
          },
        );

        if (token) {
          res.cookie("admintoken", token);

          return res.redirect("/admin/profile");
        } else {
          req.flash("login failed");

          return res.redirect("/admin/login");
        }
      }

      req.flash("error", "Invalid email or password");

      return res.redirect("/admin/login");
    } catch (error) {
      req.flash("error", "Something went wrong");

      return res.redirect("/admin/login");
    }
  }

  //manager profile
  async adminProfile(req, res) {
    try {
      const user = await User.findById(req.admin._id);

      if (!user) {
        return res.render("admin/admin_profile", {
          title: "Profile Not Found",
          data: null,
        });
      }

      res.render("admin/admin_profile", {
        title: "Admin Profile Page",
        data: user,
      });
    } catch (error) {
      req.flash(error, "Error loading profile");
    }
  }

  // dashboard page
  async adminDashboard(req, res) {
    try {
      const data = await Record.find();

      res.render("admin/admin_dashboard", {
        title: "Admin Dashboard Page",
        data: data,
      });
    } catch (error) {
      req.flash("error", "Error loading dashboard");

      res.status(500).send("Error loading dashboard");
    }
  }

  //add employee page
  async addAdminRecord(req, res) {
    res.render("add_record", {
      title: "Record Create Page",
    });
  }

  //create record
  async createAdminRecord(req, res) {
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
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/record/add");
      }
    } catch (error) {
      console.log("Error storing employee:", error);

      return res.status(500).send("Something went wrong");
    }
  }

  //edit record
  async editAdminRecord(req, res) {
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
  async updateAdminRecord(req, res) {
    try {
      const id = req.params.id;

      const edit = await Record.findByIdAndUpdate(id, req.body, { new: true });

      res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash(error, "Error in edit record");
    }
  }

  // hard delete record
  async deleteAdminRecord(req, res) {

    try {

      const id = req.params.id;

      // Check if user exists and is admin
    //   if (!id) {
    //     return res.redirect("/admin/dashboard");
    //   }

       await Record.findByIdAndDelete(id);


      return res.redirect("/admin/dashboard");

    } catch (error) {

      console.error(error);

      return res.status(500).send("Something went wrong");
    }
  }

  // logout user
  async logoutAdmin(req, res) {
    try {
      // clear cookie
      res.clearCookie("admintoken");

      return res.redirect("/admin/login");
    } catch (error) {
      req.flash("error", error.message);
    }
  }
}


module.exports = new AdminEjsController();