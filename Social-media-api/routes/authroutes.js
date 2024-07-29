const express = require("express");
const { register, login } = require("../controllers/authcontroller");

const authrouter = express.Router();

authrouter.get("/register", register);
authrouter.post("/login", login);

module.exports = authrouter;
