const express=require('express');
const User = require('../models/User');
const router=express.Router();  //express router object

router.post('/', (req,res)=>{
    res.send(req.body);
    const user=new User(req.body);
    user.save();
})

module.exports=router