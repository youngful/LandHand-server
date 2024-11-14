const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
	content: String,
	views: {
		type: Number,
		default: 0
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	img: String,
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;