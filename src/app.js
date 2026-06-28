const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully...");
  } catch (err) {
    res.send("Error saving the user:" + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// Feed API - Get / feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    //const user = await User.findByIdAndDelete({_id: userId});
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully...");
  } catch (err) {
    res.status(400).send("something went wrong...");
  }
});

// Update data of the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body; // we can update the data just by passing from the body also in postman

  try {
    await User.findByIdAndUpdate({ _id: userId }, req.body);
    res.send("updated successfully...");
  } catch (err) {
    res.status(400).send("something went wrong...");
  }
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
