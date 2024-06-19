require("dotenv").config()
const socket=require("socket.io")
const cookieParser=require("cookie-parser");
const mongoose=require("mongoose");
const cors=require("cors")
const express=require("express");
const path=require("path");
const app=express();
const root=require("./routes/root");
const {logger,logEvents}=require("./middleware/logger")
const registerRoutes=require("./routes/registerRoutes.js")
const authRoutes=require("./routes/authRoutes")
const avatarRoutes=require("./routes/avatarRoutes.js")
const userRoutes=require("./routes/userRoutes")
const messageRoutes=require("./routes/messagesRoutes")
const corsOptions=require("./config/corsOptions")
const errorHandler=require("./middleware/errorHandler")
const connectDB=require("./config/dbConn");
const allowedOrigins = require("./config/allowedOrigins");

const PORT=process.env.PORT || 4000
const DATABASE_URI=process.env.DATABASE_URI

connectDB()

app.use(express.static(path.join(__dirname,"/public")))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(logger)

app.use("/",root);
app.use("/register",registerRoutes);
app.use("/auth",authRoutes)
app.use("/getAllUsers",userRoutes)
app.use("/getAllAvatars",avatarRoutes)
app.use("/messages",messageRoutes)

app.all("*",(req,res)=>{
    res.status(404)
    if (req.accepts("html")){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }else if (req.accepts("json")){
        res.json({message:"Error 404  not found"})
    }else{
        res.type("txt").send("Error 404 page not found")
    }
})

app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    const server=app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    
    const io=socket(server,{
        cors:{
            origin:allowedOrigins,
            Credential:true
        }
    })

    global.onlineUsers=new Map()

    io.on("connection",(socket)=>{
        global.chatSocket=socket;
        socket.on("add-user",(userId)=>{
            console.log("add user")
            onlineUsers.set(userId,socket.id)
        })

        socket.on("send-msg",(data)=>{
            const sendUserSocket=onlineUsers.get(data.to);
            
            if (sendUserSocket){
                socket.to(sendUserSocket).emit("msg-receive",data.message)
            }
        })
    })
})

mongoose.connection.on('error', err => {
    //console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})