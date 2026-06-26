const express = require("express");

const app = express();

app.use(
  "/user",
  [(req, res, next) => {
    console.log("route 1");
    //res.send("Route handler 1");
    next();
  }],
  (req, res, next) => {
    console.log("route 2");
    res.send("Route handler 2");
    next();
  },
);

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
