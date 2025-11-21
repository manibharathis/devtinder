const auth =(req,res,next)=>{
    const token = "123"
    if(token=="123"){
        next()
    }
    else
    {
        res.status(401).send("un authorized User")
    }
}

module.exports = {
  auth,
};