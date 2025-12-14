const express = require("express");
const UserRouter = express.Router();
const User = require("../models/user_model");
const ConnectionRequest =  require('../models/connectionRequest')
const {auth} = require("../middleware/auth")
const USER_SAFE_DATA = "firstName lastName"
UserRouter.get("/user/requests/received", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

UserRouter.get("/user/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

UserRouter.get("/feed",auth, async (req,res)=>{
try{
  const loggedInUser = req.user
  const connectionRequest = await ConnectionRequest.find({
    $or:[{
        fromUserId: loggedInUser._id
    },{
        toUserId : loggedInUser._id
    }
     ]
  })
  const hideUserFromFeed = new Set();
   connectionRequest.forEach((connection)=>{
   hideUserFromFeed.add(connection.fromUserId.toString())
   hideUserFromFeed.add(connection.toUserId.toString())
})
const users = await User.find({
    $and:[
        {_id : {$nin: Array.from(hideUserFromFeed)}},
        {_id :{$ne:loggedInUser._d}}
    ]   
})
 .select(USER_SAFE_DATA)

 res.json({
    data : users
 })
}catch(err){
    res.status(400).json({message : err.message})
}
})

module.exports = UserRouter;