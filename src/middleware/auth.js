const jwt = require('jsonwebtoken')
const User = require('../models/user_model')
const auth =async (req,res,next)=>{
      const {token} = req.cookies
      if(!token){
        res.status(400).send("user must login")
      }
      const decodedMessage = await jwt.verify(token,'shhhhh');
      const {_id} = decodedMessage;
      const user = await User.findById(_id)
      if(!user){
        throw new Error("User not found")
      }
    req.user = user
      next()
}

module.exports = {
  auth,
};