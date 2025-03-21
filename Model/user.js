const mongose=require("mongoose")
const bcrypt=require('bcrypt');
const userSchema=new mongose.Schema({
    
    username:{
      type:String,
      required:true
    },
  
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    password:{
        type:String
    }

});

userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password')) return next();

    try{

        const salt=await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(user.password,salt)
        user.passworrd=hashedPass;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword=async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}
const User=mongose.model('User',userSchema)
module.exports=User;