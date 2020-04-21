const express = require("express");
const route = express.Router();
route.use(express.json());
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");
const bcrypt = require("bcrypt");
//auth is a middleware for verifying the token
const auth = require("../middleware/auth");
const _ = require('lodash')

route.get("/", auth, async (req, res) => {
  try {
    const users = await UserModel.find().populate('note',['title' , 'content']);
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
    res.header("token", user.generateToken()).send(user);
  } catch (e) {
    res.send(e._message);
  }
});
//

//login a user
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email:email.toLowerCase() });
    if (!user) throw "invalid email";
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      res.header("token", user.generateToken()).send(user);
    } else throw "invalid password";
  } catch (e) {
    res.send(e);
  }
});

//return users info
route.get("/me",auth, async (req, res) => {
  try {
    const user = await UserModel.findById({ _id:req.user._id });
    res.header("token", user.generateToken()).send(user);
  } catch (e) {
    res.send(e);
  }
});

// getting users notes
route.get('/notes',auth, async(req,res)=>{
  const response = await UserModel.findOne({_id:req.user._id},'note -_id').populate('note')
  const sorted = _.orderBy(response.note,'date','desc')
  res.send(sorted)
})
module.exports = route;
