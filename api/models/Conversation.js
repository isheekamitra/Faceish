const mongoose=require('mongoose');
const Conversationschema=new mongoose.Schema(
    {
  members:{
      type:Array,
  },

    
},
{timestamps:true}
);

module.exports=mongoose.model("Conversation", Conversationschema);