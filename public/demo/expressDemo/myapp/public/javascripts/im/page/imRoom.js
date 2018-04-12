/**
 * Created by liufang on 2017/6/16.
 */
//;(function(){
//    console.log('this is allUsers Page!')
//})();
define(['jquery','regular','socketIo'],function(jq,Regular,io){

    var sendNode = jq('.j-send');
    var btnNode = jq('.j-btn');
    var contentNode = jq('.j-content');

    socket = io.connect('ws://127.0.0.1:3001');

    btnNode.on('click',function(){
       var sendText = sendNode.val();
        socket.emit("message", {msg:sendText});

    });

    socket.on("message", function(obj) {
        var curContent = contentNode.html();
        contentNode.html(curContent+obj.msg);
    });
});