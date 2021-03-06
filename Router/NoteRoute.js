const express = require("express");
const route = express.Router();
route.use(express.json());
const mongoose = require("mongoose");
const NoteModel = mongoose.model("Note");
const UserModel = mongoose.model("User");
//auth is a middleware for verifying the token
const auth = require("../middleware/auth");
const _ = require("lodash");

// getting note by id
route.get("/:id", auth, async (req, res) => {
  let notes;
  try {
    if (_id)
      notes = await NoteModel.find({ _id: req.params.id }).populate("author", [
        "username",
        "email",
      ]);
    else
      notes = await NoteModel.find().populate("author", ["username", "email"]);
    res.send(notes);
  } catch (e) {
    res.send(e);
  }
});

//adding a new note
route.post("/", auth, async (req, res) => {
  try {
    //title and content of the new note
    const { title, content,color } = req.body;
    const note = new NoteModel({ title, content, author: req.user._id ,color});
    const user = await UserModel.findOne({ _id: req.user._id });
    user.note = [note._id,...user.note ];
    await note.save();
    await user.save();
    res.send(note);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
//

//delete a note
route.delete("/:id", auth, async (req, res) => {
  try {
    //note id to be deleted
    const _id = req.params.id;

    // await NoteModel.find();
    await NoteModel.findByIdAndDelete({
      _id: mongoose.Types.ObjectId(_id),
    });
    await UserModel.updateOne(
      { _id: mongoose.Types.ObjectId(req.user._id) },
      { $pull: { note: mongoose.Types.ObjectId(_id) } }
    );
    res.end();
  } catch (e) {
    res.send(e);
  }
});

//update a note
route.put("/", auth, async (req, res) => {
  try {
    //note id to be updated
    const { _id, title, content ,color} = req.body;
    const note = await NoteModel.findOneAndUpdate(
      { _id },
      { title, content,color },
      { new: true }
    );
    res.send(note);
  } catch (e) {
    res.send(e);
  }
});

module.exports = route;
