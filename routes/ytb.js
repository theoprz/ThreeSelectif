var express = require('express');
var router = express.Router();
var userModule = require('../models/Users.js');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

function checkLoginUser(req,res,next){
    var userToken=localStorage.getItem('userToken');
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');

    try {
        var decoded = jwt.verify(userToken, 'loginToken');
        if(now-setupTime > 2*60*60*1000) {
            res.redirect('/logout')
        }
    } catch(err) {
        res.redirect('/signin');
    }
    next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function checkUsername(req,res,next){
    var uname = req.body.uname;
    var checkexitemail=userModule.findOne({username:uname});
    checkexitemail.exec((err,data)=>{
        if(err) throw err;
        if(data){
            return res.render('signup', { title: 'Password Management System', msg:'Username Already Exit' });
        }
        next();
    });
}

function checkEmail(req,res,next){
    var email=req.body.email;
    var checkexitemail=userModule.findOne({email:email});
    checkexitemail.exec((err,data)=>{
        if(err) throw err;
        if(data){
            return res.render('signup', { title: 'Password Management System', msg:'Email Already Exist' });
        }
        next();
    });
}

router.get('/',checkLoginUser, function(req, res, next) {
    let loginToken=localStorage.getItem('loginUser');
    res.render('ytb', { username: loginToken});
});


module.exports = router;
