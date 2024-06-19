const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const User = require("../models/User");
const asyncHandler=require("express-async-handler")

const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find().select("-password").lean();

    if(!users?.length){
        return res.status(400).json({message:"No user found!"})
    }
    return res.json(users)
})

const getUser=asyncHandler(async(req,res)=>{
    const {id}=req.body;

    if(!id){
        return res.status(400).json({message:"User ID Required"})
    }
    const user=await User.findById(id).select("-password").lean().exec()

    return res.json(user)
})

const createNewUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;

    //confirm data
    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required!",status:false})
    }

    //verify email
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const validEmail=emailRegex.test(email);

    //check for duplicate
    const duplicateUsername=await User.findOne({username}).lean().exec()
    const duplicateEmail=await User.findOne({email}).lean().exec()

    if (duplicateUsername ){
        return res.status(409).json({message:"username exists already",status:false})
    }else if (duplicateEmail){
        return res.status(409).json({message:"Email is used already",status:false})
    }

    //Hash password
    const hashedPwd=await bcrypt.hash(password,10);  //we use 10 salts;

    
    if (!validEmail){
        return res.status(400).json({message:"Email not valid!",status:false})
    }

    //avatar name
    const avatarImage=`defaultPic.jpg`

    const userObject={username,"password":hashedPwd,email,avatarImage}

    //create new user
    const user=await User.create(userObject);

    if(user){
        return res.status(201).json({message:`New user ${username} created.`,status:false})
    }else{
        return res.status(400).json({message:"Invalid user data received.",status:true})
    }
})



module.exports={
    createNewUser,
    getAllUsers,
};