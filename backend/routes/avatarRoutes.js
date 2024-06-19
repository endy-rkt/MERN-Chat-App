const express=require("express");
const {takeAvatars} = require("../controllers/avatarController");
const router=express.Router();

router.get("/",takeAvatars);


module.exports=router