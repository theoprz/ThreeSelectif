const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    localStorage.removeItem('setupTime');
    res.redirect('../');
});

module.exports = router;
