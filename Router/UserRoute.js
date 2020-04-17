const express = require("express");
const route = express.Router();
route.use(express.json());
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");
const bcrypt = require("bcrypt");
//auth is a middleware for verifying the token
const auth = require("../middleware/auth");

route.get("/", auth, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (e) {
    res.send(e);
  }
});

//registering a new user
route.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new UserModel({ username, email, password: hashedPassword });
    await user.save();
    res.header("x-token", user.generateToken()).send(user);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
//

//login a user
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) throw "invalid email";
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      res.header("x-token", user.generateToken()).send(user);
    } else throw "invalid password";
  } catch (e) {
    res.send(e);
  }
});

module.exports = route;
