const asyncHandler = require("express-async-handler")
const Post = require("../models/postModel")
const User = require("../models/userModel")

exports.createPost = asyncHandler(async (req, res, next) => {
	const { text } = req.body

	if (!text) {
		return res.status(400).json({ error: "Please enter text" })
	}

	const userId = req?.auth?.id

	if (!userId) {
		return res
			.status(401)
			.json({ error: "Unauthorized. Please login to continue" })
	}

	try {
		//TODO: store post image in cloudinary
		const post = await Post.create({
			text,
			user: userId,
		})

		res.status(201).json({ msg: "Post created", post })
	} catch (error) {
		next(error)
	}
})

// write a controller to fetch all posts. ensure that only logged in users can view posts
exports.fetchPosts = asyncHandler(async (req, res, next) => {
	try {
		const posts = await Post.find().populate({
			path: "comments.user",
			select: "-password",
		})
		// .populate({
		// 	path: "user",
		// 	select: "-password",
		// })

		res.status(200).json({ posts, total_posts: posts.length })
	} catch (error) {
		next(error)
	}
})

exports.viewPost = asyncHandler(async (req, res, next) => {
	const { id } = req.params
	// check if id

	const post = await Post.findById(id)

	if (!post) {
		return res.status(404).json({ error: "Post not found" })
	}

	res.json(post)

	//
})

exports.deletePost = asyncHandler(async (req, res, next) => {
	const { id } = req.params
	const userId = req.auth._id
	try {
		// find the post in the db
		const post = await Post.findById(id)

		if (!post) {
			return res.status(404).json({ error: "Post not found" })
		}
		// check if the post belongs to the user

		if (post?.user?.toString() !== userId?.toString()) {
			return res
				.status(401)
				.json({ error: "Unauthorized. You can only delete your own posts" })
		}

		//TODO: delete post image from database

		await Post.findByIdAndDelete(id)

		res.status(200).json({
			msg: "Post deleted",
		})
	} catch (error) {
		console.log("Error deleting your post")
		next(error)
	}
})

exports.comment = asyncHandler(async (req, res, next) => {
	try {
		const postId = req.params.postId
		const userId = req.auth.id
		const text = req.body.text

		if (!text) {
			return res.status(400).json({ error: "Please enter comment." })
		}

		const post = await Post.findById(postId)

		if (!post) {
			return res.status(404).json({ error: "Post not found." })
		}

		const comment = {
			user: userId,
			comment: text,
		}

		console.log(comment)

		post.comments.push(comment)

		await post.save()

		res.status(200).json({ msg: "Comment added", post })
	} catch (error) {
		next(error)
	}
})

// removing comment

exports.unlikeLike = asyncHandler(async (req, res, next) => {
	try {
		const postId = req.params.postId
		const userId = req.auth.id

		const post = await Post.findById(postId)

		if (!post) {
			return res.status(404).json({ error: "Post not found." })
		}

		const len = post.likes
		const likedPost = post.likes.includes(userId)

		if (likedPost) {
			// remove user Id from likes array : unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
			await User.updateOne({ _id: postId }, { $pull: { likedPosts: postId } })

			const updatedLikes = post.likes.filter(
				(id) => id.toString() !== userId.toString()
			)

			res.json({ updatedLikes, len })
		} else {
			// add user Id to likes array : like post
			// await Post.updateOne({ _id: postId }, { $push: { likes: userId } })
			post.likes.push(userId)
			await User.updateOne({ _id: postId }, { $push: { likedPosts: postId } })
			await post.save()

			//TODO: send user notification

			const updatedLikes = post.likes
			res.status(200).json({
				msg: "Post liked",
				updatedLikes,
			})
		}
	} catch (error) {
		next(error)
	}
})

// find user posts
exports.fetchUserPosts = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id

		const posts = await Post.find({ user: userId })

		if (!posts) {
			return res.status(404).json({
				error: "No posts found. Please add posts to view it on your timeline",
			})
		}

		res.status(200).json({ posts })
	} catch (err) {
		next(err)
	}
})

// fetch following posts
exports.fetchFollowingPosts = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id

		const user = await User.findById(userId)

		if (!user) {
			return res
				.status(404)
				.json({ error: "User not found.Register and login to continue." })
		}

		const followingUsers = user.following

		const posts = await Post.find({ user: { $in: followingUsers } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "username fullname -password",
			})

		res.status(200).json(posts)
	} catch (error) {
		next(error)
	}
})

// fetch post user has liked

exports.fetchPostsUserHasLiked = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id

		const user = await User.findById(userId)

		if (!user) {
			return res
				.status(404)
				.json({ error: "User not found. Register and login to continue." })
		}

		const userLikedPosts = await Post.find({ id: { $in: user.likes } })

		res.status(200).json({ userLikedPosts })
	} catch (error) {
		next(error)
	}
})
// exports.unlikeLike= asyncHandler(async(req,res,next)=>{})
// exports.unlikeLike= asyncHandler(async(req,res,next)=>{})
// exports.unlikeLike= asyncHandler(async(req,res,next)=>{})