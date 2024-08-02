const express = require("express");
const { register, login } = require("../controllers/authcontroller");

const authrouter = express.Router();

authrouter.post("/register", register);
authrouter.post("/login", login);

module.exports = authrouter;
