/**
 * Created by liufang on 2017/7/18.
 */

var browserAPI = {};

browserAPI.getHref = function(req,res,next){
    res.json({
        result: 1,
        data: {url:'//study.163.com'}
    });
};


module.exports = browserAPI;
