
const express = require("express");
const app = express();
const User = require("./models/user_model");
const {auth} = require("./middleware/auth")
const connectDB = require("./config/database")
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
connectDB()
 .then(()=>{
console.log("connected to db")
app.listen(3000, () => {
 console.log("Server is successfully listening on port 3000");
});
 })
 .catch((err)=>{
  console.log(err)
 })

app.use(express.json())
app.post("/signup", async (req,res)=>{
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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

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

app.patch("/user", async (req,res)=>{
  const userId = req.body.userId;
  const data = req.body;
  const allowedUpdate = ["userid","about","gender","age"]
  const isUpdateAllowed = Object.keys(data.every((k) => allowedUpdate.includes(k)));
  if(!isUpdateAllowed){
    res.status(400).send("update not allowed ,")
  }
  try{
    const user = await User.findByIdAndUpdate({_id:userId},data,{
      returnDocument :"after",
      runValidators : true
    })
    res.send("user added successfully!")
  }
  catch(err){
    res.status(400).send("update failed "+ err.message)
  }
})
 


app.get("/profile", auth, async(req, res) => {
  try {
    const user = req.user;
    res.send({ user });
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.get("/postupdatebyemail",async(req,res)=>{
  const user = await User.findOneAndUpdate(
  { email: req.body.email },
  {
    
    phone: "9876543210"
  },
  { new: true }
  );
  res.send(user)
})

app.get("/sendConnectionrequest",auth,async(req,res)=>{
   res.send("connection req sent")
})




