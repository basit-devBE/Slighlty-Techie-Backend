const express = require("express");
const requireSign = require("../middlewares/authMiddlewares");
const { createPost, allPost } = require("../controllers/postcontollers");

const createpostrouter = express.Router();

createpostrouter.post("/create", requireSign,createPost)
createpostrouter.get("/allposts", requireSign,allPost)

module.exports = createpostrouter;