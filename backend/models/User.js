const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        min:8
    },
    avatarImage:{
        type:String,
        default:""
    },
    isAvatarSet:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports=mongoose.model("User",userSchema);