// 


    const router =require('express').Router();
    const User = require('../models/SignUp.model');
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcrypt");
    const auth = require("../middleware/auth");
    process.env.SECRET_KEY='secret'
   
    // const { model } = require('../models/SignIn.model');
    // const router = require('./NewAdPost');
    router.post("/register",async (req,res)=>{
      try{
        let {username,useremail,userphonenumber,userpassword,userconformpassword,useragree}= req.body;

        //validation 
        if(!useremail || !userphonenumber || !userpassword || !userconformpassword )
          return res.status(400).json({msg:"Not all fields have been entered."});
        if(userpassword.length < 5)
        return res.status(400).json({msg:"The password lenght must be atleast 5 charachters."});
        if(userphonenumber.length < 10)
        return res.status(400).json({msg:"The invalid phone number."});
        if(userpassword!== userconformpassword)
        return res
          .status(400)
          .json({msg: "Enter the same password twice for verfication."});
        //   const existingUserphone = await User.findOne({userphonenumber:userphonenumber})
        //   if(existingUserphone)
        //   return res
        // .status(400)
        // .json({msg: "An Account with this phoneNumber is already exists."});

        const existingUser = await User.findOne({useremail:useremail})
        if(existingUser)
        return res
        .status(400)
        .json({msg: "An Account with this email is already exists."});

        if(!username) username =useremail;

        // dont need to save the password as plain text to database because some hacket hack it eassaly 
        // we use bcrypt function to encyript the password

        const salt = await bcrypt.genSalt();
        const passwordhash = await bcrypt.hash(userpassword,salt);
        // console.log(passwordhash);

        //saving the users 
        const newUser = User({
          username,
          useremail,
          userphonenumber,
          userpassword:passwordhash,
          useragree
        });
        const savedUser = await newUser.save();
        res.json(savedUser);

      } catch(err){
        res.status(500).json({error:err.message});
        
      }
 
});

router.post("/login", async (req,res)=>{
  try{
    const {useremail,userpassword} =req.body;
    if(!useremail || !userpassword)
    return res
    .status(400)
    .json({msg: "Not all fields have been entered."});

    const user= await User.findOne({useremail:useremail});
    if(!user)
    return res
    .status(400)
    .json({msg: "No account with this email has been registered."});

    const isMatch=await bcrypt.compare(userpassword, user.userpassword);
    if(!isMatch)
    return res
    .status(400)
    .json({msg: "invalid credentials"});
    

    let token = jwt.sign({id:user._id},process.env.SECRET_KEY);
    res.json({
      token,
      user:{
          id:user._id,
          username:user.username,
          
         
      },
    })
  }catch(err){
    res.status(500).json({error:err.message});
  }
});



//delete account
router.delete("/delete",auth ,async (req,res)=>{
  try{
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);

  }catch(err){
    res.status(500).json({error:err.message});
  }
});

router.post("/tokenIsValid", async (req,res)=>{
  try{
    const token = req.header("x-auth-token");
    if(!token) return res.json(false);

    const verified = jwt.verify(token ,process.env.SECRET_KEY);
    if(!verified) return res.json(false);

    const user= await User.findById(verified.id);
    if(!user) return res.json(false);
    
    return res.json(true);
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

router.get("/",auth,async (req,res)=>{
  const user = await User.findById(req.user);
  // res.json(user);
  res.json({
    username:user.username,
    id:user._id,
  })

})

module.exports=router;






// const express = require("express")
// const users =require('express').Router();
// const cors = require("cors")
// const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")

// let signUp=require('../models/SignUp.model');
// users.use(cors())
// process.env.SECRET_KEY='secret'

// users.post('/new-add',(req,res)=>{
//   const today = new Date()
//   const userData = {
//      username:req.body.username,
//      useremail:req.body.useremail,
//      userphonenumber:req.body.userphonenumber,
//      userpassword:req.body.userpassword,
//      userconformpassword:req.body.userconformpassword,
//      useragree:req.body.useragree,
//      created:today
//   }
//   signUp.findOne({
//     useremail: req.body.useremail
//   })
//   .then(user=>{
//     if(!user){
//       bcrypt.hash(req.body.userpassword,10,(err,hash)=>{
//         userData.userpassword=hash
//         signUp.create(userData)
//         .then(user=>{
//           res.json({status:user.useremail+ 'refisrered!'})
//         })
//         .catch(err=>{
//           res.send('error:'+ err)
//         })
//       })
//     }else{
//       res.json({error:'User already exists'})
//     }
//   })
// })

// users.post('/add',(req,res)=>{
//   signUp.findOne({
//     userphonenumber:req.body.userphonenumber
//   })
//   .then(user=>{
//     if(user){
//       if(bcrypt.compareSync(req.body.userpassword,user.userpassword)){
//         const payload={
//           _id:user._id,
//           username:user.username,
//           useremail:user.useremail,
//           userpassword:user.userpassword,
//           userconformpassword:user.userconformpassword,
//           useragree:user.useragree
          
//         }
//         let token =jwt.sign(payload,process.env.SECRET_KEY,{
//           expiresIn:1440
//         })
//         res.send(token)
//       }else{
//         res.json({error:"user does not exist"})
//       }
//     }else{
//       res.json({error:"user does not exist"})
//     }
//   })
//   .catch(err=>{
//     res.send('error:'+ err)
//   })
// })

// users.get('/profile',)


// // router.route('/new-add').post((req,res)=>{
// //     const username=req.body.username;
// //     const useremail=req.body.useremail;
// //     const userphonenumber=req.body.userphonenumber;
// //     const userpassword=req.body.userpassword;
// //     const userconformpassword=req.body.userconformpassword;
// //     const useragree=req.body.useragree;
    
    
// //     const sign_up = new signUp({
// //       username,
// //       useremail,
// //       userphonenumber,
// //       userpassword,
// //       userconformpassword,
// //       useragree
// //     });
// //     sign_up.save()
// //     .then(()=>res.json('record added!'))
// //     .catch(err => res.status(400).json('Error : ' + err));
// // });

// module.exports=users; 