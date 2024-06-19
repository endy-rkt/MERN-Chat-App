const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const User=require("../models/User")
const asyncHandler=require("express-async-handler")

const login=asyncHandler(async (req,res)=>{
    const {username,password}=req.body

    if(!username || !password){
        return res.status(400).json({message:"All fields are required!"})
    }

    const foundUser=await User.findOne({username}).exec()

    if(!foundUser){
        return res.status(401).json({message:"Unauthorized!"})
    }

    const match=await bcrypt.compare(password,foundUser.password)

    if(!match)  return res.status(401).json({message:"Unauthorized!"})

    const accessToken=jwt.sign(
        {"username":foundUser.username,},
        process.env.ACCESS_TOKEN_KEY,
        {expiresIn:"15m"}
    )

    const refreshToken = jwt.sign(
        {"username":foundUser.username},
        process.env.REFRESH_TOKEN_KEY,
        {expiresIn:"1d"}
    )

    
    res.cookie("jwt",refreshToken,{
        httpOnly:true,
        //secure:true,
       
        maxAge:7*24*60*60*1000,
    })

    //send accessToken 
    res.status(200).json({accessToken})
})

const refresh = (req, res) => {
    const cookies = req.cookies
 
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
  
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err, decoded) => {
            
            if (err) return res.status(403).json({ message: 'Forbidden' })
            
            const foundUser = await User.findOne({ username: decoded.username }).select("-password").exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized 000' })

            const accessToken = jwt.sign(
                {
                    "username":foundUser.username
                },
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: '15m' }
            )

            res.json({ accessToken,"user":foundUser })
        }
    )
}

const verifyJWT=(req,res)=>{
    const authHeader=req.body.headers.authorization || req.body.headers.Authorization
    
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"})
    }

    const token=authHeader.split(" ")[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err,decoded)=>{
            if (err)    return res.status(403).json({message:"Forbidden"})
            req.user=decoded.username
        }
    )
    res.json({message:true})
}

const logout=(req,res)=>{
    const cookies=req.cookies;
   

    if(!cookies?.jwt)   return res.sendStatus(204)

    res.clearCookie("jwt",{httpOnly:true,sameSite:"None",secure:true})

    return res.json({message:"Cookie cleared",status:true})
}

module.exports={
    login,
    refresh,
    verifyJWT,
    logout,
}