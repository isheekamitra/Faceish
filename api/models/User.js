const mongoose=require('mongoose');
const Userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6,
       
    },
    profilePicture:{
        type:String,
        default:""
       
    },
    coverPicture:{
        type:String,
        default:""
       
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    notification:{
       type:Array,
    },
    from:
    {
        type:String,
        max:50
    },
    relation:{
        type:Number,
        enum:[1,2,3]
    },
    tokens:[
        {
            token:{
                type:String,
        required:true
            }
        }

    ]
},
{timestamps:true}
);
Userschema.methods.generateAuthToken=async function(){
    try{
           let token= jwt.sign({_id:this._id},process.env.SECRET_KEY);
           this.tokens=this.tokens.concat({token:token});
           await this.save();
           return token;
    }catch(err){
          console.log(err);
    }
}
module.exports=mongoose.model("User",Userschema);