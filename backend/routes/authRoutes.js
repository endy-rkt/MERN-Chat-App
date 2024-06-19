const express=require("express");
const { login, refresh, logout, verifyJWT } = require("../controllers/authController");
const router=express.Router();

router.post("/",login);

router.get("/refresh",refresh)

router.post("/verifyAuth",verifyJWT)

router.get("/logout",logout)

module.exports=router