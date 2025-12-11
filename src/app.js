const express = require("express");
const app = express();
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser");
app.use(express.json())
app.use(cookieParser());
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profileRouter")
const connectionRequestRouter = require('./routes/connectionrequestrouter')
app.use('/', authRouter)
app.use('/',profileRouter)
app.use('/',connectionRequestRouter)
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















