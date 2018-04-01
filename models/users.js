const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

const User=module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByEmail = function(email,callback){
    const query = {email:email}
    User.findOne(query,callback);
}

module.exports.addUser=function(newUserObj,callback){

    bcrypt.genSalt(10, function(err, salt) {    //check bcrypt js document
        bcrypt.hash(newUserObj.password, salt, function(err, hash) {
            if(err) throw err;
            newUserObj.password=hash;
            newUserObj.save(callback);
        });
    });
    
    
}

module.exports.comparePassword = function(userpassword,hash,callback){
    bcrypt.compare(userpassword, hash, function(err, res) {
    if(err) throw err;
    callback(null,res);
    });
}