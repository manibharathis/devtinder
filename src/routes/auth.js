const express = require("express");
const authRouter = express.Router();
const User = require("../models/user_model");
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt')

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
  await newUser.save()  
  res.send("added user")
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

    // 4️⃣ Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now()+8 *360000) //expires in 8 hrs
    });

    res.send("Login success");
  } catch (err) {
    res.status(500).send("Login failed: " + err.message);
  }
});

module.exports = authRouter