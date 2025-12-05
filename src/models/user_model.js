const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        trim : true
    },
    lastName :{
        type: String
    },
    email :{
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        
    },
    phone :{
        type: String,
        //unique : true,
        minlength:10,
        default :"enter your phone"
    },
    age:{
        type: Number,
        min:1,
        max:120
    },
    gender:{
        type : String,
       // required : true,
        validate: {
      validator: function (value) {
        const allowed = ["male", "female", "other"];
        return allowed.includes(value.toLowerCase()); 
      },
      message: (props) => `${props.value} is not a valid gender!`
    }
    },
    password: {
  type: String,
  required: true,
  minlength: 6
}     
},
 {
        timestamps:true
    }
)


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "shhhhh",{expiresIn : '7d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
     const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid
}


module.exports = mongoose.model("User",userSchema)