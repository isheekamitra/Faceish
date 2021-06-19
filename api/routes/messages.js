const router=require('express').Router();
const Message =require('../models/Message');
//add
router.post('/',async(req,res)=>{
    const newmsg= new Message(req.body);
    try{
        const savedmsg=await newmsg.save();
        res.status(200).json(savedmsg);

    }catch(err){
        res.status(500).json(err);
    }

})
//get
router.get('/:conversationId',async(req,res)=>{
    try{
      const messages= await Message.find({
          conversationId:req.params.conversationId,

      });
      res.status(200).json(messages);
    }catch(err){
        res.status(500).json(err);
    }
});
module.exports=router;