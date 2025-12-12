const express = require("express");
const connectionRequestRouter = express.Router();
const User = require("../models/user_model");
const ConnectionRequest =  require('../models/connectionRequest')
const {auth} = require("../middleware/auth")
connectionRequestRouter.post("/request/send/:status/:id",auth,async(req,res)=>{
   const fromUserId = req.user._id;
   const toUserId = req.params.id;
   const status = req.params.status;
   const allowedStatus = ["ignored","interested"]
      console.log("to user id "+ toUserId)
      const toUser = await User.findById(toUserId)
      if(!toUser){
         res.status(400).send("user not found")
      }
      if(!allowedStatus.includes(status)){
         res.status(400).json({message:"invalid status type "+status})
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
         $or :[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
         ]
      })
      if(existingConnectionRequest){
         res.status(400).send("connection request is already present")
      }
      const connectionRequest = new ConnectionRequest({
         fromUserId,
         toUserId,
         status
      })
      const data = await connectionRequest.save();
     res.json({
      message : `${fromUserId} sent ${status} ${toUserId} `,
      data
     })

   res.send("connection req sent")
})

connectionRequestRouter.post("/request/review/:status/:requestId",auth,async(req,res)=>{
  try{
   const {status,requestId} = req.params
   const loggedInUser = req.user
   const allowedStatus = ["accepted","rejected"]
   if(!allowedStatus.includes(status))
      res.status(400).send("Invalid Request")
   const connectionRequest = await ConnectionRequest.findOne({
      _id : requestId,
      toUserId : loggedInUser._id,
      status : "interested"
   })
   if(!connectionRequest){
      res.status(400).send("connection request not found");
   }
   connectionRequest.status = status
   const data = await connectionRequest.save();
   res.send(data)
    }catch(err){
      res.status(400).send("ERROR: "+err)
    }
})
module.exports = connectionRequestRouter;