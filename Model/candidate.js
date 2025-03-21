const mongose=require('mongoose')

const candidateSchema= new mongose.Schema({
  username:{
    type:String,
    required:true
  },
  party:{
    type:String,
    required:true
  },
  age:{
    type:Number,
    required:true
  }
  ,
  votes:[
    {
        user:{
            type:mongose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        votedAt:{
            type:Date,
            default:Date.now()
        }
    }
    
],
  voteCount:{
    type:Number,
    default:0
  }


});
const Candidate=mongose.model('Candidate',candidateSchema)
module.exports=Candidate;