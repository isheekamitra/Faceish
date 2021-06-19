const jwt=require("jsonwebtoken");
const User=require('../models/User');
const authenticate=async(req,res,next)=>{
    try{
        const token=req.cookies.jwtoken;
        const verify=jwt.verify(token,process.env.SECRET_KEY);
        const rootuser=await User.findOne({_id:verify._id,"tokens.token":token})
        if(!rootuser){
            throw new Error('User not found');
        }
        req.token=token; 
        req.rootuser=rootuser;
        req.userid=rootuser._id;
        next();

    }catch(err){
        res.status(401).send('Unauthorized:No token provided');
        console.log(err);
    }

}
module.exports=authenticate;