const router=require('express').Router();
const Conversation =require('../models/Conversation');
//new conv
router.post('/',async(req,res)=>{
    const newconversation=new Conversation(
        {
            members:[req.body.senderId,req.body.receiverId],

        }
    );
    try{
       const saveconvo= await newconversation.save();
       res.status(200).json(saveconvo);
    }catch(err){
        res.status(500).json(err);
    }
});
//get conv of a user
router.get('/:userId',async(req,res)=>{
    try{
        const conversation= await Conversation.find({
            members:{ $in:[req.params.userId]},

        })
        res.status(200).json(conversation);

    }catch(err){
        res.status(500).json(err);
    }
})
//get conv includes two user id
router.get('/find/:fuserId/:suserId',async(req,res)=>{
    try{
      const conversation=await Conversation.findOne({
        members:{ $all:[req.params.fuserId,req.params.suserId]},

      });
      res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports=router;