const express = require("express");
const requireSign = require("../middlewares/authMiddlewares");
const { createPost } = require("../controllers/postcontollers");

const createpostrouter = express.Router();

createpostrouter.post("/create", requireSign,createPost)

module.exports = createpostrouter;