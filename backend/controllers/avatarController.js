const fs=require("fs")
const path=require("path")
const asyncHandler=require("express-async-handler")

const takeAvatars=asyncHandler((req,res)=>{
    const avatarFolder=path.join(__dirname,"../avatars")

    //reading the contents of the folder
    fs.readdir(avatarFolder,(err,files)=>{
        if (err){
            return res.status(500).json({message:err})
        }else{
            const imageFiles=files.filter(file=>{
                const filePath=path.join(avatarFolder,file)

                const stat=fs.statSync(filePath)

                return stat.isFile() 
            })
            
            const imageDataPromises=imageFiles.map(file=>{
                return new Promise ((resolve,reject)=>{
                    const filePath=path.join(avatarFolder,file)

                    fs.readFile(filePath,async (err,data)=>{
                        if (err){
                            reject(err)
                        }else{
                            
                            resolve({
                                filename:file,
                                data:data.toString("base64")
                            })
                        }
                    })
                })
            })

            Promise.all(imageDataPromises)
                        .then(imageData=>{
                            res.json(imageData)
                        })
                        .catch(err=>{
                            console.log(err)
                            res.status(500).json({err})
                        })
        }
    })
})

module.exports={takeAvatars}