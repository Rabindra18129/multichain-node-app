require('dotenv').config();
require('./consumer');
var express=require('express');
var app=express();
var port=process.env.PORT||4000;
app.use('/health',(req,res)=>{
    res.status(200).send('App is running');
});
app.use('/',(req,res)=>{
    res.status(200).send('Hello World!');
});
app.use((req,res)=>{
    res.status(404).send('Not Found');
});

app.listen(port,()=>{
    console.log(`Server Started at port ${port}`);
});