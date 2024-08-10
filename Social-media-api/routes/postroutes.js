const express = require("express")
const {
	createPost,
	fetchPosts,
	viewPost,
	deletePost,
	comment,
	unlikeLike,
	fetchUserPosts,
	fetchPostsUserHasLiked,
} = require("../controllers/postcontroller")
const requireSign = require("../middlewares/authMiddleware")
const postRouter = express.Router()

postRouter.post("/create", requireSign, createPost)
postRouter.get("/", requireSign, fetchPosts)
postRouter.get("/:id", requireSign, viewPost)
postRouter.delete("/:id", requireSign, deletePost)
postRouter.put("/comment/:postId", requireSign, comment)
postRouter.put("/likes/:postId", requireSign, unlikeLike)
postRouter.get("/user-posts", requireSign, fetchUserPosts)
postRouter.get("/user-liked-posts", requireSign, fetchPostsUserHasLiked)

module.exports = postRouter