const express = require("express");
var cors = require('cors')

const PORT = process.env.PORT || 3000; // fallback only for local
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

const connectDB = require("./config/database")
const cookieParser = require("cookie-parser");

app.use(express.json())
app.use(cookieParser());
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profileRouter")
const connectionRequestRouter = require('./routes/connectionrequestrouter')
const userConnector = require('./routes/userRouter')
app.use('/', authRouter)
app.use('/',profileRouter)
app.use('/',connectionRequestRouter)
app.use('/',userConnector)
 connectDB()
 .then(()=>{
console.log("connected to db")
  app.listen(PORT, () => {
        console.log(`Server is successfully listening on port ${PORT}`);
    });
 })
 .catch((err)=>{
  console.log(err)
 })















