const express = require("express");
const route = express.Router();
route.use(express.json());
const mongoose = require("mongoose");
const NoteModel = mongoose.model("Note");
const UserModel = mongoose.model("User");
//auth is a middleware for verifying the token
const auth = require("../middleware/auth");

route.get("/", auth, async (req, res) => {
  try {
    const notes = await NoteModel.find().populate('author',['username' , 'email']);
    res.send(notes);
  } catch (e) {
    res.send(e);
  }
});

//adding a new note
route.post("/add",auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new NoteModel({ title, content, author:req.user._id })
    const user =await UserModel.findOne({_id:req.user._id})
    user.note=[...user.note,note._id]
    await note.save()
    await user.save()
    res.send(user)

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
