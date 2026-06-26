const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User data sent");
});

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
