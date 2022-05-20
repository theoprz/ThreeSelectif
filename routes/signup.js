var express = require('express');
var router = express.Router();
var userModule = require('../models/users');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

function checkLoginUser(req,res,next){
    var userToken=localStorage.getItem('userToken');
    try {
        var decoded = jwt.verify(userToken, 'loginToken');
    } catch(err) {
        res.redirect('/signup');
    }
    next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function checkUsername(req,res,next){
    var uname = req.body.uname;
    var checkexitemail = userModule.findOne({username: uname});
    checkexitemail.exec((err, data)=>{
        if(err) {
            throw err;
        }
        if(data){
            return res.render('signup', { msg:'Username Already Exit' });
        }
        next();
    });
}

function checkEmail(req,res,next){
    var email = req.body.email;
    var checkexitemail=userModule.findOne({email: email});
    checkexitemail.exec((err,data)=>{
        if(err) {
            throw err;
        }
        if(data){
            return res.render('signup', { msg:'Email Already Exit' });
        }
        next();
    });
}

router.get('/', function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    if(loginUser){
        res.redirect('./dashboard');
    }else{
        res.render('signup', { title: 'Password Management System', msg:'' });
    }
});
router.post('/',checkUsername,checkEmail,function(req, res, next) {
    var userDetails;
    var username=req.body.uname;
    var email=req.body.email;
    var password=req.body.password;
    var confpassword=req.body.confpassword;
    if(password !== confpassword){
        res.render('signup', { msg:'Password not matched!' });

    }else{
        password =bcrypt.hashSync(req.body.password,10);
        userDetails = new userModule({
            username:username,
            email:email,
            password:password,
            ingame: false,
            inventory: {
                cannettes: 0,
                bouteillesverre: 0,
                aliments: 0,
                plastiques: 0,
                cigarettes: 0,
                carton: 0
            },
            chapter: 0,
        });
        userDetails.save((err,doc)=>{
            if(err) throw err;
            res.render('signup', { msg:'User Registerd Successfully' });
        })  ;
    }


});

router.get('/logout', function(req, res, next) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/');
});
module.exports = router;
