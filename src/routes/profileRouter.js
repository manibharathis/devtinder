const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user_model");
const {auth} = require("../middleware/auth")
const bcrypt = require('bcrypt')
profileRouter.get("/profile", auth, async(req, res) => {
  try {
    const user = req.user;
    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

profileRouter.get("/postupdatebyemail",auth,async(req,res)=>{
  const user = await User.findOneAndUpdate(
  { email: req.body.email },
  { 
    phone: "9876543210"
  },
  { new: true }
  );
  res.send(user)
})

profileRouter.post("/updatepassword",auth,async(req,res)=>{
  try{
  const { currentPassword, newPassword } = req.body;

 
  const isPasswordValid = await req.user.validatePassword(currentPassword)

    if (!isPasswordValid) {
      return res.status(400).send("Incorrect current password");
    }
     const hashPassword = await bcrypt.hash(newPassword,10)
     req.user.password = hashPassword;
    await req.user.save();
    res.send("Password updated successfully");
  }
  catch(err){
     res.status(500).send("Error updating password: " + err.message);
  }
})

module.exports = profileRouter