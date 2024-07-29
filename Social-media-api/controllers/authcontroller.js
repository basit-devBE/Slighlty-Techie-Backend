const dummyusers =[]
const express = require("express");

exports.register = async (req, res) => {
    const newuser = dummyusers.push(req.body)
    res.json({msg:"registered successfully",
        newuser});
};

exports.login = async (req, res) => {
    res.send("Login");
};

console.log(dummyusers)
