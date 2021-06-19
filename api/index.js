const express=require('express');
const cors=require('cors');
const app=express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userrute=require('./routes/users');
const authrute=require('./routes/auth');
const postrute=require('./routes/posts');
const conversationrute=require('./routes/conversations');
const messagerute=require('./routes/messages');
const multer=require('multer');
const path=require('path');
dotenv.config();
mongoose.connect(process.env.URL, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('database connected');
});
mongoose.set('useCreateIndex', true);

app.use('/images',express.static(path.join(__dirname,'public/images')));
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name);
        // cb(null, file.fieldname + '-' + Date.now() + 
        // path.extname(file.originalname));
    },
});
 const upload=multer({storage:storage});

app.post('/api/upload',upload.single('file'),(req,res)=>{
    try{
        console.log("ho gaya"+req.file.filename);
           return res.status(200).json("File uploaded succesfully");
    }catch(err){
        console.log(err);
    }
});
app.use('/api/users',userrute);
app.use('/api/auth',authrute);
app.use('/api/posts',postrute);
app.use('/api/conversations',conversationrute);
app.use('/api/messages',messagerute);
app.listen(8800,()=>{
    console.log("backend server is ready");
});