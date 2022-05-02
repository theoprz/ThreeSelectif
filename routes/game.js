const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    res.render('game', { title: "Test de page 2" });
});

module.exports = router;
