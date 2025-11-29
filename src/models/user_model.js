const mongoose = require("mongoose");
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
    // phone :{
    //     type: String,
    //     unique : true,
    //     minlength:10,
    //     default :"enter your phone"
    // },
    // age:{
    //     type: Number,
    //     min:1,
    //     max:120
    // },
    // gender:{
    //     type : String,
    //     required : true,
    //     validate: {
    //   validator: function (value) {
    //     const allowed = ["male", "female", "other"];
    //     return allowed.includes(value.toLowerCase()); 
    //   },
    //   message: (props) => `${props.value} is not a valid gender!`
    // }
    // },
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

module.exports = mongoose.model("User",userSchema)