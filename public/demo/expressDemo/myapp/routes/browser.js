var express = require('express');
var browserAPI = require('../lib/api/browserAPI');

var router = express.Router();

/* GET home page. */
router.get('/allOptions',function(req,res,next){
    res.render('browser/allOptions');
});

//api
router.get('/getHref',browserAPI.getHref);

module.exports = router;
