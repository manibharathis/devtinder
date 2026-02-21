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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "phone"
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};


module.exports = {
    validateSignUpData,
    validateEditProfileData
}