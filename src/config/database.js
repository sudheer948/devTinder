const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://muhammedsudheer210_db_user:dJzdeED8AdqyKUmu@namastenode.swwntcc.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
