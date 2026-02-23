const express = require("express");
const authRouter = express.Router();
const User = require("../models/user_model");
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt')

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

authRouter.post("/signup", async (req,res)=>{
   console.log(req.body)
  try{
     validateSignUpData(req.body)
     const firstName = req.body.firstName
     const lastName = req.body.lastName
     const email = req.body.email
     const password = req.body.password
    
     const hashPassword = await bcrypt.hash(password,10)
     console.log(hashPassword)
     const newUser = new User (
    {
      firstName,
      lastName,
      email,
      
      password : hashPassword
    }
  )
    const savedUser = await newUser.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  }catch(err){
       res.status(400).send("error in signup "+ err.message)
  }
  
})

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    // 2️⃣ Compare password
    const isPasswordValid = await user.validatePassword(password)

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    // 3️⃣ Generate token
    const token = await user.getJWT()

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
});
   console.log("login success!")
    res.json( user);
  } catch (err) {
    res.status(500).send("Login failed: " + err.message);
  }
});


module.exports = authRouter