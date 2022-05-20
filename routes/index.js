const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    let loginToken = localStorage.getItem('loginUser');
    res.render('index', { username: loginToken});
});

module.exports = router;
