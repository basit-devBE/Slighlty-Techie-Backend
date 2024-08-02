const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	read: {
		type: Boolean,
		default: false,
	},
	// like your post, comment, follow you
	notificationType: {
		type: String,
		required: true,
		enum: ["follow", "like", "comment"],
	},
})

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
