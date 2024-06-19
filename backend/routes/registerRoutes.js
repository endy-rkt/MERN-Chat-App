const express=require("express");
const router=express.Router();
const fileUpload=require("express-fileupload");
const path=require("path")
const User=require("../models/User")
const asyncHandler=require("express-async-handler")
const filesPayloadExists=require("../middleware/filesPayloadExists")
const fileSizeLimiter=require("../middleware/fileSizeLimiter")
const fileExtLimiter=require("../middleware/fileExtLimiter")
const {createNewUser}=require("../controllers/userController")

router.post("/",createNewUser);

router.post("/setPic",
  fileUpload({createParentPath:true}),
  filesPayloadExists,
  fileExtLimiter([".png",".jpg",".jpeg"]),
  fileSizeLimiter,
  asyncHandler(async(req,res)=>{
    //taking req
      const {email}=req.body

      console.log("email",email)
      const files=req.files

      const user=await User.findOne({email}).select("-password").exec();
      
      var picName=""

      Object.keys(files).forEach(key=>{
        //create pathName
        picName=`${email}.jpg`
        const filepath=path.join(__dirname,"../avatars",picName)
        

        //save given image
        files[key].mv(filepath,(err)=>{
          if(err) return res.status(500).json({message:err})
        })
      })

      user.avatarImage=picName;
      user.isAvatarSet=true;

      const updatedUser=await user.save()

      return res.json({message:`Avatar updated for ${updatedUser.username}`})
  }))

module.exports=router;