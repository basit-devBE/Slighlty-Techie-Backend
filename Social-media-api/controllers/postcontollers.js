const expressAsyncHandler = require("express-async-handler")
const Post = require("../models/postModel.js")

exports.createPost = expressAsyncHandler(async (req, res,next) => {
    const {text} = req.body
    if(!text){
        return res.status(400).json({error: "Text is required"})
    }
    const userId = req?.auth?.id
    if(!userId){
        return res.status(401).json({error: "You are not authorized to access this route"})
    }
    try{
        const post = await Post.create({text, user: userId})
        res.status(201).json({message: "Post created successfully", post})
    }catch(error){
        next(error)
    }
});