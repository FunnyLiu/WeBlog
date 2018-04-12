# expressdemo-myapp教程
本demo为简单的表单增删改查逻辑全部过一道.

首先通过 sh start.sh来启动项目.
如果显示数据库未连接,则到数据库目录的bin文件夹，执行 ./mongod


成功连接后,访问localhost:3000 即可访问页面

或者通过debug插件:
DEBUG=myapp npm start
启动项目。
通过localhost:3000来查看项目。

# 项目架构

lib为库文件，比如api或者中间件，public是主要前端部分，routes是控制路由部分，models是数据库模型绑定部分，views是模板引擎部分。

以路由为入口来说明，uers.js：
```
var express = require('express');
var usersAPI = require('../lib/api/usersAPI');
var router = express.Router();

/* GET users listing. */

router.get('/allUsers', function(req, res, next) {
    res.render('users/allUsers');
});
router.get('/addEditUser',function(req,res,next){
    res.render('users/addEditUser');
});

//api
router.get('/getAllUsers',usersAPI.getAllUsers);
router.get('/getOneUser',usersAPI.getOneUser);
router.post('/sendUserInfo',usersAPI.sendUserInfo);
router.post('/removeUser',usersAPI.removeUser);

module.exports = router;
```


可以看到，路由中一部分用来管理跳转，一部分用来管理api。

# mongodb操作
这里使用mognoose,mongoose是一个用来在node中处理mongo数据库的相关工具。
在入门项目中的使用，首先体现在数据库连接上，start.js:
```
/**
 * Created by liufang on 2016/11/29.
 */
var debug = require('debug')('myapp');
var mongoose = require('mongoose');

var app = require('./app');
var config = require('./config/config');

app.set('config',config);

//启动mongo
mongoose.connect(app.get('config').dbUrl);
mongoose.connection.on('connected',function(){
    console.log('connect to the mongodb success');
});
mongoose.connection.on('error',function(err){
    console.log('connect to the mongodb error:'+err);
    process.exit(1);
});
mongoose.connection.on('disconnected',function(){
    console.log('disconnect mongodb');
    process.exit(1);
});

app.listen(app.get('config').port || 3000,function(){
    console.log('Express server start success');
    debug('Express server listening on port '+ app.get('config').port || 3000);
});

其中dbUrl为'mongodb://localhost/myapp'。
```
然后就是体现在数据库操作api的增删改查中usersAPI.js：
```
/**
 * Created by liufang on 2016/11/29.
 */
var UsersSchema =require('../../models/users/usersSchema');

var usersAPI = {};

usersAPI.getAllUsers = function(req,res,next){
    UsersSchema.
        find().
        sort({'age': -1}).
        exec('find',function (err,data){
            if(err){
                console.log('getAllUsers error '+err);
                next(err);
            }else{
                res.json({
                    result: 1,
                    data: data
                });
            }
        });


    //var a = new UsersSchema({'name':'lf','age':23});
    //a.save();

};

usersAPI.getOneUser = function(req,res,next){
    var name = req.query.name;
    UsersSchema.findOne({'name':name},function(err,data){
        if(err){
            console.log('getOneUser error '+err);
            next(err);
        }else{
            res.json({
                result: 1,
                data: data
            });
        }
    })
};

usersAPI.sendUserInfo = function(req,res,next){
    var model = req.body;
    UsersSchema.update({name:model.name},model,{upsert:true},function(err,data){
       if(err){
           console.log('save user error,'+err);
           res.json({
               result:0
           });
       } else {
           console.log('save user success,name='+model.name);
           res.json({
               result:1
           });
       }
    });
};

usersAPI.removeUser = function(req,res,next){
    var model = req.body;
    var name = model.name;
    UsersSchema.remove({'name':name},function(err,data){
        if(err){
            console.log('removeUser error,'+err);
            res.json({
                result:0
            });
        }else{
            console.log('removeUser success');
            res.json({
                result:1
            });
        }
    })
};

module.exports = usersAPI;
```