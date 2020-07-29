var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  text: String,
  //will help associate users and comments
  //and save authors name to a comment automatically
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports - mongoose.model("Comment", commentSchema);