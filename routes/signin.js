var express = require('express');
var router = express.Router();
var userModule = require('../models/users');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

router.get('/', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if(loginUser){
        res.redirect('./dashboard');
    }else{
        res.render('signin', { msg:'' });
    }
});

router.post('/', function(req, res, next) {
    var username = req.body.uname;
    console.log(username);
    var password = req.body.password;
    var checkUser=userModule.findOne({username: username});
    checkUser.exec((err, data)=>{
        console.log(data)
        if(data==null){
            res.render('signin', { msg:"Invalid Username and Password." });
        }else{
            if(err) {
                throw err;
            }
            var getUserID = data._id;
            var getPassword = data.password;
            if(bcrypt.compareSync(password,getPassword)){
                var token = jwt.sign({ userID: getUserID }, 'loginToken');
                localStorage.setItem('userToken', token);
                localStorage.setItem('loginUser', username);
                var now = new Date().getTime();
                localStorage.setItem('setupTime', now);
                res.redirect('/dashboard');
            }else{
                res.render('signin', { title: 'Password Management System', msg:"Invalid Username and Password." });

            }
        }
    });

});

module.exports = router;
