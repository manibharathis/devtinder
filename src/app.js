
const express = require("express");
const app = express();
const User = require("./models/user_model");
const {auth} = require("./middleware/auth")
const connectDB = require("./config/database")
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt')
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
app.post("/login",async (req,res)=>{
  const {email,password} = req.body
  const user = User.findOne({email:email})
  if(!user){
    res.status(400).send("invalid credential")
  }
  const isPasswordValid = bcrypt.compare(password,user.password)
  if(!isPasswordValid){
     res.status(400).send("invalid credential")
  }
  res.send("login success")
})

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



app.get("/getbyemail", async(req,res)=>{
  const user = await User.find({email:req.body.email})

  res.send(user)
})

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