const router=require('express').Router();
const User= require('../models/User');
const bcrypt=require('bcrypt');
const authenticate=require('../middleware/authenticate');
//REGISTER
router.post('/register',async (req,res)=>{
  
   try{
       //generate new password
       const salt=await bcrypt.genSalt(10);
       const hashedpass=await bcrypt.hash(req.body.password,salt);
       //create new user
       const newuser= new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedpass,
    });
    //save user and return
     const user=await newuser.save();
     res.status(200).json(user);
   }catch(err){
    res.status(500).json(err);
   }
});

//LOGIN
router.post('/login',async(req,res)=>{
    try{
  const user=await User.findOne({email:req.body.email});
  if(!user){
    
  return res.status(404).json('user not found');
   }
  const validpass=await bcrypt.compare(req.body.password,user.password)
  if(!validpass)
  return res.status(400).json('wrong password');
  res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports=router