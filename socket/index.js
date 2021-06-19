const io = require("socket.io")(8900,{
cors:{
    origin:"http://localhost:3000",
},
});
let users=[];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  const removeuser=(socketId)=>{
      users=users.filter(user=>user.socketId!==socketId);
  }
  const getuser=(userId)=>{
      return users.find(user=>user.userId===userId);
  }
io.on("connection", (socket) =>{
    //when connect
    console.log("a user connected");
    // take useId and socketId from user
    socket.on("addUser",(userId)=>{
        addUser(userId,socket.id);
        io.emit('getusers',users);
    });
    //send and get message
    socket.on('sendmsg',({senderId,recieverId,text})=>{
      const user=getuser(recieverId);
      io.to(user.socketId).emit('getmsg',{
        senderId,text,
      });
    })
    //when disconnect 
    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        removeuser(socket.id);
        io.emit('getusers',users);
    })
});