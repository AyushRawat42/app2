const mongose=require("mongoose")
const bcrypt=require('bcrypt');
const BillSchema=new mongose.Schema({
    
    FirstName:{
      type:String,
      required:true
    },
  
  
    LastName:{
        type:String,
        required:true
    },
    Addressline1:{
        type:String,
        required:true
     
    },
  Addressline2:{
    type:String,
  },
  City:{
    type:String,
    required:true
 },
  State:{
    type:String,
    required:true
 
  },
  ZIP:{
    type:Number,
    required:true
  },
  Phone:{
    type:Number,
    required:true
  },
  Email:{
    type:String,
    required:true
  },
  FirstName2:{
    type:String,
    required:true
  },


  LastName2:{
      type:String,
      required:true
  },
  Addressline1b:{
      type:String,
      required:true
   
  },
Addressline2b:{
  type:String,
},
City2:{
  type:String,
  required:true
},
State2:{
  type:String,
  required:true

},
ZIP2:{
  type:Number,
  required:true
},
Cardnum:{
    type:Number,
  required:true
},
Namecard:{
    type:String,
  required:true
},
Expiry:{
    type:String,
  required:true
},
CVV:{
    type:Number,
  required:true
}

});


const Bill=mongose.model('Bill',BillSchema)
module.exports=Bill;