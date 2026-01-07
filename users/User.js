const mongoose = require("mongoose");
const { Schema } = mongoose;
const db = require("../db/db");

const User = new Schema ({
  nick: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  pass: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
})

const Users = mongoose.model("User", User);

module.exports = Users;