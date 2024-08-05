const express = require("express");
const { register, login, Update, fetchUsers } = require("../controllers/authcontroller");
const requireSign = require("../middlewares/authMiddlewares");

const authrouter = express.Router();

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.put("/updateUser/:id", requireSign, Update)
authrouter.get("/allusers" ,requireSign,fetchUsers)

module.exports = authrouter;
