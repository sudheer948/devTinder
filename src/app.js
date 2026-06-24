const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Akshay", lastName: "Saini" });
});

app.post("/user", (req, res) => {
  console.log("Save Data to the database");
  res.send("Data successfully saved to the database!");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello hehehehehe");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
