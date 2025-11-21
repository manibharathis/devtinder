
const express = require("express");
const app = express();
const User = require("./models/user_model");
const {auth} = require("./middleware/auth")
const connectDB = require("./config/database")

app.use("/test", (req, res) => {
 res.send("Hello test1 from the server!!");
 
});

app.use("/user",auth,(req,res)=>{
    res.send({
        "name ":"mani,",
        "age":29
    })
})
app.post("/signup",async(req,res)=>{
  const newUser = new User({
    firstName :"mani",
    lastName :"sekar",
    email :"remasekar.96@gmai.com",
    phone :"9894470"
  })
  await newUser.save() 
  res.send("added user")
})
app.use("/test/123", (req, res) => {
 res.send("Hello 123!!");
});
app.use((req, res) => {
 res.send("Hello from the server!!");
});


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