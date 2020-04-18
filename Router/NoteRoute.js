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
      //title and content of the new note
    const { title, content } = req.body;
    const note = new NoteModel({ title, content, author:req.user._id })
    const user =await UserModel.findOne({_id:req.user._id})
    user.note=[...user.note,note._id]
    await note.save()
    await user.save()
    res.send(note)

  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
//

//delete a note
route.delete("/delete",auth, async (req, res) => {
  try {
      //note id to be deleted
      const {_id}=req.body
      const note =await NoteModel.findOneAndDelete({_id});
      const user = await UserModel.findById({_id:req.user._id})
      user.note.pull(_id)
      user.save()
      note.save()
      res.send(user.note)
    
  } catch (e) {
    res.send(e);
  }
});

//update a note
route.put("/update",auth, async (req, res) => {
    try {
        //note id to be updated
        const {_id,title,content}=req.body
        const note =await NoteModel.findOneAndUpdate({_id},{title,content},{new:true});
        res.send(note)
    } catch (e) {
      res.send(e);
    }
  });

module.exports = route;
