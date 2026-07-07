const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  const { firstName } = user;

  console.log("Sending a connection request");

  res.send(firstName + " sent the connection request");
});

connectDB()
  .then(() => {
    console.log("Database connection is established...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database connection is not connected...");
    console.log(err);
  });
