---
title: 使用socket.io与express结合，体验websocket
date: 2017-06-17 13:43:22
categories: "node"
---

# **前言**
自己于express框架的基础上，以node为服务端，基于[socket.io](https://github.com/socketio/socket.io)，实现了一个建议的聊天室。
成功从服务端推送数据到客户端。
效果如下图：
![img](../使用socket-io与express结合，体验websocket/1.gif)
将客户端的信息传递到服务端后，服务端主动推送给客户端。

# **websocket原理**
简单来说，就是服务端主动推送信息给客户端。看看其与http协议的区别：
![img](../使用socket-io与express结合，体验websocket/2.png)

websocket有如下特点：
其他特点包括：
　　（1）建立在 TCP 协议之上，服务器端的实现比较容易。
　　（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
　　（3）数据格式比较轻量，性能开销小，通信高效。
　　（4）可以发送文本，也可以发送二进制数据。
　　（5）没有同源限制，客户端可以与任意服务器通信。
　　（6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。
ws://example.com:80/some/path

可以看看理解：
![img](../使用socket-io与express结合，体验websocket/3.png)


# **服务端实现**
服务端是基于node的web框架express，在其基础上，使用socket.io模块来实现的。
首先安装socket.io:
```
npm install --save-dev socket.io 
```
然后在对应的模块监听：
```javascript
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
        //延迟3s返回信息给客户端
        setTimeout(function(){
            console.log('the websokcet message is'+obj);
            io.emit("message", obj);
        },3000);
    });
});
//开启端口监听socket
server.listen(3001);

router.get('/imRoom', function(req, res, next) {
    res.render('im/imRoom');
});


module.exports = router;
```

# **客户端**
客户端也需要对应引入一个socket.io.js文件。
```javascript
define(['jquery','socketIo'],function(jq,io){

    var sendNode = jq('.j-send');
    var btnNode = jq('.j-btn');
    var contentNode = jq('.j-content');
    //建立连接
    socket = io.connect('ws://127.0.0.1:3001');

    btnNode.on('click',function(){
        var sendText = sendNode.val();
        //向服务端发送信息
        socket.emit("message", {msg:sendText});

    });
    //接收服务端推送的信息
    socket.on("message", function(obj) {
        var curContent = contentNode.html();
        contentNode.html(curContent+obj.msg);
    });
});
```

看起来是不是很简单就实现了。其实websocket的使用还需要考虑很多因素，比如性能、负载等等。这里只是简单的体验了一些。