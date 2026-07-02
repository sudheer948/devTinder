const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 4,   
    maxlength: 50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAMWiNPZNlJ0woIwELDn6oSI2_K7H7tH37Cqi4a3bZXQ&s=10",
  },
  about: {
    type: String,
    default: "This is a default about of the user!",
  },
  skills: {
    type: [String],
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
