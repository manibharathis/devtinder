const validator = require("validator")
const validateSignUpData = (body)=>{
const {firstName,lastName,email,password} = body
  if(!firstName || !lastName){
    throw new EncodedAudioChunkrror("name is not valid!")
  }
  else if(!validator.isEmail(email)){
    throw new Error("email is not valid")
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("please enter strong password")
  }
}

module.exports = {
    validateSignUpData
}