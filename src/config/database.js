const mongoose = require("mongoose");
const connectDB = async() =>{
    await mongoose.connect(
        // "mongodb+srv://remasekar96:@cluster0.vrazetd.mongodb.net/?appName=Cluster0"
       //"mongodb+srv://remasekar96:jJ9nbWC0ee3xlcFk@cluster0.vrazetd.mongodb.net/users?retryWrites=true&w=majority"
    "mongodb+srv://remasekar96:jJ9nbWC0ee3xlcFk@cluster0.vrazetd.mongodb.net/User"
    ).then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
}
module.exports = connectDB;