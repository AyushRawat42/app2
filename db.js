const mongoose=require('mongoose')
require('dotenv').config();
const mongoURL=process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
})
const db=mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to mongoDC");
});


db.on('error',(err)=>{
    console.error("MongoDB Connection server",err);
});

db.on('disconnected',()=>{
    console.log("mongoDb Disconnected");
});

module.exports=db;