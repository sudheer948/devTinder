const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    // we can also write loggedInUser to explicitly mention or user
    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);

    await loggedInUser.save(); // it is actually a mongoose document (instance of the User model)

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const loggedInUser = req.user;
    console.log(password);
    console.log(loggedInUser);

    if (!password) {
      throw new Error("Enter the valid password!");
    }

    const isStrongPassword = validator.isStrongPassword(password);
    if (!isStrongPassword) {
      throw new Error("Enter a strong password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.json({
      message: `Your password has been updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
