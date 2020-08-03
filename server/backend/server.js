
const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/afcars1',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
})
        
.then(()=> console.log('connected to database successfully'))
.catch(err=>console.error('could not connect to mongoo DB',err));


const port =process.env.PORT || 5000;

//setting up over middle ware
// app.use(bodyParser.urlencoded({extended:true}))
const app=express();
app.use(express.json());
app.use(cors());


// Here we just tell the server to use the files that we have created

const new_ad_postRouter=require('./routes/NewAdPost');
const sign_inRouter=require('./routes/SignIn');
const sign_upRouter=require('./routes/SignUp');
const post_newtruckRouter=require('./routes/PostNewTrucks');
const post_newbikeRouter=require('./routes/PostNewBikes');
// const FileuploadRouter=require('./FileUpload');


//Here we require the files and then use the files
app.use('/new-ad-post',new_ad_postRouter);

app.use('/sign-in',sign_inRouter);
app.use('/users',sign_upRouter);
app.use('/post-new-truck',post_newtruckRouter);
app.use('/post-new-bike',post_newbikeRouter);
// app.use('/uploads',FileuploadRouter);

app.listen(port ,()=>{
    console.log(`Server is running on port : ${port}`);
});

