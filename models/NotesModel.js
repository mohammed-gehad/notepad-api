const mongoose = require("mongoose");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: function(){
      if(this.content)return false
       return true
    },
    maxlength: 255,
  },
  content: {
    type: String,
    required: function(){
      if(this.title)return false
       return true
    },  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  color:String
});

userSchema.pre('save', function(next) {
  if(!this.title){
    this.title='no title'
  }
  if(!this.content){
    this.content='no content'
  }
  next();
});

mongoose.model("Note", userSchema);
