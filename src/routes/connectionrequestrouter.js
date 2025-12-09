const express = require("express");
const profileRouter = express.Router();
const User = require("./models/user_model");
const {auth} = require("./middleware/auth")
const connectDB = require("./config/database")
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
profileRouter.get("/sendConnectionrequest",auth,async(req,res)=>{
   res.send("connection req sent")
})