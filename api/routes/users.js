
const router=require('express').Router();
const User=require('../models/User');
const bcrypt=require('bcrypt');
//update user
router.put('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id||req.body.isAdmin){
             if(req.body.password){
                 try{
                     const salt =await bcrypt.genSalt(10);
                     req.body.password=await bcrypt.hash(req.body.password,salt);

                 
             }catch(err){
                return res.status(500).json(err);
             }
            }
            try{
                const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body});
                res.status(200).json('Account has been updated');
            }catch(err){
                return res.status(500).json(err);
            }
    }else{
        return res.status(403).json('You can update only your account');
    }
});
//detete user
router.delete('/:id',async(req,res)=>{
    if(req.body.userId===req.params.id||req.body.isAdmin){
            try{
                const user=await User.findByIdAndDelete(req.params.id);
               
                res.status(200).json('Account has been deleted');
            }catch(err){
                return res.status(500).json(err);
            }
    }else{
        return res.status(403).json('You can delete only your account');
    }
});
// get a user
router.get('/',async(req,res)=>{
    const userId=req.query.userId;
    const username=req.query.username;
    try{
        // await User.findOne({username:username});
       
      const user= userId?await User.findById(userId):await User.findOne({username:username});
       
      const {password,updatedAt,...other}=user._doc;
       res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    }
});
//get friends
router.get('/friends/:userId',async(req,res)=>{
    try{
        const user=await User.findById(req.params.userId);
        const friends =await Promise.all(
            user.following.map((friendId)=>{
                return User.findById(friendId);
            })
            
        );
        let friendlist=[];
        friends.map((friend)=>{
            const {_id,username,profilePicture}=friend;
            friendlist.push({_id,username,profilePicture});
        });
        res.status(200).json(friendlist);
    }catch(err){
        res.status(500).json(err);
    }
});
// follow a user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
      try{
           const user=await User.findById(req.params.id);
           const currentuser=await User.findById(req.body.userId);
           if(!user.followers.includes(req.body.userId)){
              await user.updateOne
              ({$push:{followers:req.body.userId}});
              await currentuser.updateOne
              ({$push:{following:req.params.id}});
              res.status(200).json('user has been followed');
              

           }else{
             res.status(403).json('You already follow this user');
           }
      }catch(err){
         res.status(500).json(err);
      }
    }else{
        res.status(403).json("You cant follow yourself");
    }
});
// unfollow user
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId!==req.params.id){
      try{
           const user=await User.findById(req.params.id);
           const currentuser=await User.findById(req.body.userId);
           if(user.followers.includes(req.body.userId)){
              await user.updateOne
              ({$pull:{followers:req.body.userId}});
              await currentuser.updateOne
              ({$pull:{following:req.params.id}});
              res.status(200).json('user has been followed');
              

           }else{
             res.status(403).json('You dont follow this user');
           }
      }catch(err){
         res.status(500).json(err);
      }
    }else{
        res.status(403).json("You cant unfollow yourself");
    }
});
router.post('/notification',async(req,res)=>{
    if(req.body.userId){
        User.findById(req.body.userId,(err,user)=>{
            if(err){
                res.json(err);
            }
            else
            {
                let notifications= User.notification;
                let blank=[];
                User.notification=blank;
                User.save();
                res.json(notifications);
            }
        })
    }else{
        res.json("No user provided"); 
    }
})

module.exports=router