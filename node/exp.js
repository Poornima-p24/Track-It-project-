var express=require("express");
var app=express();
const port=5000;
app.get('/',(req,res)=>res.send("S.a engineering clg"));
app.listen(port,()=>console.log("server running"));