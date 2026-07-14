const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully...");
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  console.log("route hit");
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 hrs
      });

      res.send("Login Successful!!!");
    } else {
      throw new Error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful");
});

module.exports = authRouter;
