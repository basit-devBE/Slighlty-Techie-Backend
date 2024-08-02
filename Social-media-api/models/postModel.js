const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema(
	{
		text: {
			type: String,
			required: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		postImg: {
			imgUrl: String,
			publicId: String,
		},
		comments: [
			{
				comment: {
					type: String,
					require: true,
				},
				user: {
					type: Schema.Types.ObjectId,
					ref: "User",
					require: true,
				},
			},
		],
	},
	{ timestamps: true }
)

const Post = mongoose.model("Post", postSchema)
module.exports = Post
