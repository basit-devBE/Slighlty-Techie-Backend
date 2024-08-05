const asyncHandler = require('express-async-handler')
const User = require("../models/userModel.js")
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');
const expressAsyncHandler = require('express-async-handler');

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


exports.login = asyncHandler(async (req, res, next) => {
	try {
		// validate inputs
		const { username, email, password } = req.body

		if ((!username && !email) || !password) {
			return res.status(400).json({ error: "Please enter username or email" })
		}

		const user = await User.findOne({ $or: [{ username }, { email }] }).select(
			"password"
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

        res.status(200).json({ msg: "Logged in", token, userID:user.id})
	} catch (error) {
		next(error)
		
	}
})

exports.Update = expressAsyncHandler(async (req,res,next) => {
    // const {id} = req.params.id
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }
        if(user){
            const { username, email, fullname} = req.body
            user.username = username || user.username
            user.email = email || user.email
            user.fullname = fullname || user.fullname
            const updatedUser = await user.save()
            res.status(200).json({message: "User updated successfully", updatedUser})
        }
    }catch(error){
        next(error)
    }
})

exports.fetchUsers = asyncHandler(async (req, res) => {
	const users = await User.find()
	res.status(200).json({ users })
})