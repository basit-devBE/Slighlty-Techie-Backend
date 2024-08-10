const express = require("express")
const {
	register,
	login,
	fetchUsers,
	fetchUserProfile,
	myProfile,
	followUnfollow,
	updateProfile,
	suggestUsersToFollow,
	searchUser,
} = require("../controllers/authController")
const requireSign = require("../middlewares/authMiddleware")
const authRouter = express.Router()

// http://localhost:4789/api/v1/auth/register :
authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/users", fetchUsers)
authRouter.get("/me", requireSign, myProfile)
authRouter.put("/follow-unfollow/:id", requireSign, followUnfollow)

authRouter.put("/user-update", requireSign, updateProfile)
authRouter.get("/user-suggestions", requireSign, suggestUsersToFollow)
authRouter.get("/:username", fetchUserProfile)

module.exports = authRouter