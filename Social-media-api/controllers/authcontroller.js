const asyncHandler = require('express-async-handler')
const User = require("../models/userModel.js")
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');

exports.register = async (req, res, next) => {
    const { username, email, password, fullname } = req.body;

    if (!username || !email || !password || !fullname) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password length should be at least 8 characters" });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ error: "User already exists with the username or email provided" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            fullname
        });

        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = generateToken(user.id)

        res.status(200).json({ message: "User logged in successfully" ,token});

    } catch (error) {
        next(error);
    }
};
