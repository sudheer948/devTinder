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
