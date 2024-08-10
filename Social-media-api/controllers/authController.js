const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")
const generateToken = require("../utils/generateToken")

exports.register = asyncHandler(async (req, res, next) => {
	// validate user input
	const { username, email, password, fullname } = req.body

	if (!username || !email || !password || !fullname) {
		return res.status(400).json({ error: "Please enter all fields" })
	}
	const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!validEmail.test(email)) {
		res.status(400).json({ error: "Please enter a valid email address" })
		return false
	}

	if (password.length < 8) {
		return res
			.status(400)
			.json({ error: "Password must be at least 8 characters" })
	}

	// check if user already exists using username and email
	// const existingUser = await User.find({ email })

	const userExists = await User.findOne({ $or: [{ username }, { email }] })

	if (userExists) {
		return res
			.status(400)
			.json({ error: "User already exists with username or email provided" })
	}

	// hash user password with bcryptjs

	const salt = await bcrypt.genSalt(10)

	const hashPassword = await bcrypt.hash(password, salt)

	try {
		const user = await User.create({
			username,
			email,
			password: hashPassword,
			fullname,
		})
		res.status(201).json({ msg: "Registered", user })
	} catch (error) {
		next(error)
	}
})

exports.login = asyncHandler(async (req, res, next) => {
	try {
		// validate inputs
		const { username, email, password } = req.body

		if ((!username && !email) || !password) {
			return res.status(400).json({ error: "Please enter username or email" })
		}

		const user = await User.findOne({ $or: [{ username }, { email }] }).select(
			"+password"
		)

		if (!user) {
			return res.status(400).json({ error: "User not found" })
		}

		// compare password
		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" })
		}

		const token = generateToken(user.id)

		await user.save()

		res.status(200).json({ msg: "Logged in", token })
	} catch (error) {
		next(error)
		// res
		// 	.status(500)
		// 	.json({ error: "Internal server error. Please try again later." })
	}
})

exports.fetchUsers = asyncHandler(async (req, res) => {
	const users = await User.find()
	res.status(200).json({ users })
})

exports.myProfile = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id

		const user = await User.findById(userId)

		res.status(200).json({ user })
	} catch (error) {
		next(error)
	}
})

exports.fetchUserProfile = asyncHandler(async (req, res, next) => {
	try {
		const username = req.params.username
		const user = await User.findOne({ username })
		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		res.status(200).json(user)
	} catch (error) {
		next(error)
	}
})

exports.followUnfollow = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id
		const id = req.params.id // user to follow's id

		if (id?.toString() === userId?.toString()) {
			return res.status(400).json({ error: "You can't follow yourself" })
		}

		//current logged in user
		const currentUser = await User.findById(userId) // rudolf

		// user to follow
		const userToFollow = await User.findById(id) // basit

		// find user by username
		// const userToFollow = await User.findOne({ username: req.query.username })

		if (!userToFollow || !currentUser) {
			return res.status(404).json({ error: "User not found" })
		}

		const isFollowing = currentUser.following.includes(id)

		if (isFollowing) {
			// unfollow user (basit)
			await User.updateOne({ _id: userId }, { $pull: { following: id } })

			// remove rudolf from users following basit
			await User.findByIdAndUpdate(id, { $pull: { followers: userId } })

			// TODO: send a notification to notify user
			res
				.status(200)
				.json({ msg: `You are have unfollowed ${userToFollow.username}` })
		} else {
			// follow user (basit)
			await User.updateOne({ _id: userId }, { $push: { following: id } })

			// add rudolf to users following basit
			await User.findByIdAndUpdate(id, { $push: { followers: userId } })

			//TODO: send a notification to notify user
			res
				.status(200)
				.json({ msg: `You are now following ${userToFollow.username}` })
		}
	} catch (error) {
		next(error)
	}
})

exports.searchUser = asyncHandler(async (req, res, next) => {
	try {
		// find user by username
		const user = await User.findOne({ username: req.query.username })

		res.status(200).json({ msg: `You searched for `, user })
	} catch (error) {
		next(error)
	}
})

exports.updateProfile = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id
		const {
			username,
			newPassword,
			oldPassword,
			bio,
			fullname,
			location,
			website,
		} = req.body

		if ((!newPassword && oldPassword) || (newPassword && !oldPassword)) {
			return res
				.status(400)
				.json({ error: "Please enter new password and old password" })
		}

		const user = await User.findById(userId).select("+password")

		if (!user) {
			return res.status(404).json({ error: "User not found" })
		}

		// update user password
		const isMatch = await bcrypt.compare(oldPassword, user.password)

		if (!isMatch) {
			return res.status(400).json({
				error: "Invalid credentials. Updating user password not allowed",
			})
		}

		if (newPassword < 8) {
			return res
				.status(400)
				.json({ error: "Password must be at least 8 characters" })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(newPassword, salt)
		user.password = hashedPassword
		// update user data
		user.username = username || user.username
		user.bio = bio || user.bio
		user.fullname = fullname || user.fullname
		user.location = location || user.location
		user.website = website || user.website

		// TODO: upload images [profile image and banner image]

		await user.save()

		user.password = null
		res.status(200).json({ msg: "Profile Updated", user })
	} catch (err) {
		next(err)
	}
})

exports.suggestUsersToFollow = asyncHandler(async (req, res, next) => {
	try {
		const userId = req.auth.id
		const usersFollowedByMe = await User.findById(userId).select("following")

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		])

		const filteredUsers = users.filter((user) => {
			return !usersFollowedByMe.following.includes(user._id.toString())
		})

		const userSuggestions = filteredUsers.slice(0, 5)

		userSuggestions.forEach((user) => (user.password = null))

		res.status(200).json(userSuggestions)
	} catch (error) {
		next(error)
	}
})
exports.logout = asyncHandler(async (req, res, next) => {})
