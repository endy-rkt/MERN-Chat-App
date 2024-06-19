const asyncHandler=require("express-async-handler")
const User=require("../models/User")
const Message=require("../models/Message")

const addMessage=asyncHandler(async (req,res)=>{
    const {from,to,message}=req.body;

    const data=await Message.create({
        message:{text:message},
        users:[from,to],
        sender:from,
    })

    if (data) return res.status(200).json({message:"Message added successfully."})
    else return res.status(500).json({message:"Failed to add message to the database."})
})

const getAllMessages=asyncHandler(async(req,res)=>{
    const {from,to}=req.body

    const messagess=await Message.find({
        users:{
            $all:[from,to]
        },
    }).sort({updatedAt:1})
    
    const projectMessages=messagess.map((msg)=>{
        return {
            fromSelf:msg.sender.toString() === from,
            message:msg.message.text
        }
    })

    return res.status(200).json(projectMessages)
})

module.exports={
    addMessage,
    getAllMessages
}