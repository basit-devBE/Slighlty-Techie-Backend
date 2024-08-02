const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generateToken = (userId) => {
    const token = jwt.sign({id: userId}, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE || "3d",
    })
    return token
}

module.exports = generateToken