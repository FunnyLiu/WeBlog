var express = require('express');
var router = express.Router();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on("disconnect", function() {
        console.log("a user go out");
    });

    socket.on("message", function(obj) {
        setTimeout(function(){
            console.log('the websokcet message is'+obj);
            io.emit("message", obj);
        },3000);
    });
});

server.listen(3001);

router.get('/imRoom', function(req, res, next) {
    res.render('im/imRoom');
});


module.exports = router;
