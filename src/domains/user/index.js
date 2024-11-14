const express = require("express");
const routes = express.Router();

const {
  signup_post,
  login_post,
  logout_get,
} = require("./controller");

routes.get("/log_out", logout_get);
routes.post("/sign_up", signup_post);
routes.post("/log_in", login_post);

module.exports = routes;