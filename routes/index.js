const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    let loginToken = localStorage.getItem('loginUser');
    console.log(loginToken);
    res.render('index', { username: loginToken});
});

module.exports = router;
