const express=require('express');
const app=express();
require('dotenv').config();
const User=require('./Model/user')
const db=require('./db');
const bodyParser=require('body-parser')
app.use(bodyParser.json())
const PORT= process.env.port ||3000
const path = require('path');
const cors = require('cors');
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// app.post('/signup',async (req,res) => {
//   try{
//     const data=req.body;
//     const newUser=new User(data);
//     const reponse= await newUser.save();
//     console.log("User Save");

//     const payload={
//       id:reponse.id
//     }
//     console.log(payload)
//     res.status(200).json({response:reponse});
//   //  const token= generateToken(payload)
//   //  res.status(200).json({response:reponse,token:token});
//   }
//   catch(err){
//       console.error(err);
//       res.status(500).json({error:"Unable to sign up"});
//   }
// });


app.post('/submit', async (req, res) => {
  try {
    // Access the incoming data from req.body
    const { username, email,phone,part,year,model } = req.body;
console.log(req.body)
    // Create a new user document
    const newUser = new User({username, email,phone,part,year,model});

    // Save the new user to the database
    await newUser.save();

    // Send a success response back to the client
    res.status(201).json({ message: 'User added successfully!', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding user.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});