const express=require("express");
const { getAllMessages, addMessage } = require("../controllers/messagesController");
const router=express.Router();

router.post("/getAllMessages",getAllMessages)

router.post("/addMessage",addMessage)

module.exports=router