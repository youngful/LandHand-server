const express = require("express");
const router = express.Router();

const userRoutes = require("../domains/user");
const postRoutes = require("../domains/posts");

router.use("/user", userRoutes);
router.use("/post", postRoutes);

module.exports = router;