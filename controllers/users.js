const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const justicecoinWallet = require('./wallet.js');
const wallet =  new justicecoinWallet('45.33.26.209');


router.post('/register', (req,res,next)=>{    
    if (!req.body.email || !req.body.password) {
        res.json({success:false, msg : 'Please provide email and password'});
        return;
    }
    
    wallet.createAddress().then(addr => {
        let newUser = new User({
            email : req.body.email,
            password : req.body.password,
            address : addr.address
        });
        
        User.addUser(newUser, (err,user)=>{
            if(err){
                res.json({success:false, msg : 'Failed to register'});
            }
            else{
                res.json({success:true, msg:'User Registered'});
            }
        }); 
    });
});

router.post('/authenticate',(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.getUserByEmail(email,(err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg : 'User not found'});
        }
        
        User.comparePassword(password,user.password,(err,res2)=>{
            if(err) throw err;
            if(res2){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });
                
                return  res.json({
                    success:true,
                    token:'bearer '+token,
                    user:{
                        id:user.id,
                        email:user.email,
                        address: user.address
                    } 
                });
            }
            else{
                return res.json({success:false,msg:'Wrong Password'});
            }
        });
    });
});

router.get('/balance', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({'balance': 'TO be done'});
});

module.exports = router; 