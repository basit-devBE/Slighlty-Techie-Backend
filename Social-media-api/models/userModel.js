const mongoose = require("mongoose")
const Schema = mongoose.Schema

// create/ define our model
//       crimson
// varchar(255)

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		fullname: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minLength: [8, "Please password length should not be less than 7"],
			select: false
		},
		bio: {
			type: String,
		},
		bannerImg: {
			imgUrl: String,
			publicId: String,
		},
		profileImg: {
			imgUrl: String,
			publicId: String,
		},
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		// bookmarks
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
		isAdmin: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin", "Super Admin"],
		},
		subscribed: {
			type: Boolean,
			default: false,
		},
		likedPosts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Post",
				default: [],
			},
		],
	},
	{ timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User
