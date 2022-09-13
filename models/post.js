const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  message: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  time_posted: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
