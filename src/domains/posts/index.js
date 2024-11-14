const express = require("express");
const routes = express.Router();

const {
	get_posts,
	create_post,
	get_post,
	view_post
} = require("./controller");

routes.get("/get_posts", get_posts);
routes.get("/get_post/:id", get_post);
routes.get("/view_post/:id", view_post);
routes.post("/create_post", create_post);

module.exports = routes;