const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = function(req,res) {
    // console.log('body:',req.body);
    const user = new User(req.body);
    // console.log('user:',user);
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                err
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    })
}

exports.signin = function(req,res) {
    const {email,password} = req.body;
    User.findOne({email},(err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:"User with that email not exist!"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error:"Email and Password dont match!"
            })
        }

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
        res.cookie('t',token,{expire:new Date() + 9999});
        const {_id,name,email,role} = user;
        return res.json({
            token,
            user:{
                _id,
                name,
                email,
                role 
            }
        })

    })
}

exports.signout = function(req,res) {
    res.clearCookie('t');
    return res.json({message:"Signout Success!"})
}

exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms: ['HS256']
})

exports.isAuth = function(req,res,next){
    const user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        res.status(403).json({
            error:"Access denied!"
        })
    }
    next();
}

exports.isAdmin = function(req,res,next){
    const user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(req.profile.role === 0){
        res.status(403).json({
            error:"Access denied!"
        })
    }
    next();
}