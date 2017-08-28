---
title: socket.io使用实践
date: 2017-08-07 10:38:09
categories: "node"
---

# 前言
之前对socket.io进行了一些简单的体验[使用socket.io与express结合,体验websocket](/2017/06/17/使用socket-io与express结合，体验websocket/)
这里主要对项目中,它的一些使用细节进行整理,方便日后的复用.

# 普通使用
其实看上面的文章中就知道了,普通就是通过on和emit方法,进行服务端和客户端的通信监听和调用.

比如服务端:
```javascript
socket.on("publish", function (data) {
    api.publish(data.name,emitPublishProgress);
});

```

和客户端调用:
```javascript
socket.emit('publish', {
    name: g.specialName
});
```

# 广播
如果需要服务端触发后,除了自己在内的所有客户端均得到消息,则需要广播功能.
```javascript
socket.broadcast.emit("publishProgress",{
    progress:progress,
    info:info
});
```
客户端还是通过on来监听即可.
```javascript
socket.on("publishProgress", function(data) {
    console.log('now progress is:' + data.progress);
    var _proc = data.progress;

    //if (_proc == 0) {
    if(_proc !=1 && !logDialog){
        logDialog = new modal({
            data: {
                'class': "bm-module-log-modal",
                contentTemplate: "<bm-log-dialog prec={prec} log={log} ready={ready} />",
                prec: 0,
                title: "专题制作中...",
                log: "",
                ready: false
            }
        });

        logDialog.$on('ok', function() {
            logDialog.destroy();
            logDialog = undefined;
        });
    } else if (_proc == 1) {
        logDialog.data.title = '专题制作完成！';
        logDialog.data.ready = true;
    }

    setLogContent(logDialog, data);
});
```

# 广播包括自己
给包括自己在内的所有客户端广播消息
```javascript
io.sockets.emit("publishProgress",{
    progress:progress,
    info:info
});
```

# 分组
服务端:
```javascript
socket.on('group1', function (data) {
    socket.join('group1');
});
socket.on('group2',function(data){
    socket.join('group2');
 });
```
客户端发送:
```javascript
socket.emit('group1')
socket.emit('group2')
```
就可以加入对应的分组.
一个客户端可以存在多个分组（订阅模式）
踢出分组
```javascript
socket.leave(data.room);
```

对分组中的用户发送信息
```javascript
//不包括自己
socket.broadcast.to('group1').emit('event_name', data);
//包括自己
io.sockets.in('group1').emit('event_name', data);
```



