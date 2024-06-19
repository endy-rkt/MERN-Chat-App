const filesPayloadExists=(req,res,next)=>{
    if (!req.files) return res.status(400).json({message:"File missing!"})

    next()
}

module.exports=filesPayloadExists