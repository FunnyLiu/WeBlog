(function() {
    var o = {},
        f = function() {return !1;},
        cache = {};
    var is = function(data,type){
        return o.toString.call(data)==='[object '+type+']';
    };
    return function(key,func) {
        var result = cache[key],
            isfunc = is(func,'Function');
        // func is data
        if (func!=null&&!isfunc){
            result = func;
        }
        // do function defined
        if (isfunc){
            var arr = [];
            for(var i=2,l=arguments.length;i<l;i++){
                arr.push(arguments.callee(arguments[i]));
            }
            var exports = {};
            arr.push.call(arr,exports,{},f,[]);
            var ret = func.apply(null,arr)||exports;
            if (!result||!is(ret,'Object')){
                // for non-object return
                result = ret;
            }else{
                // for namespace return
                // bad performance for-in in v8 for instance
                if (!!Object.keys){
                    for(var ls=Object.keys(ret),i=0,l=ls.length,x;i<l;i++){
                        x = ls[i];
                        result[x] = ret[x];
                    }
                }else{
                    for(var x in ret){
                        result[x] = ret[x];
                    }
                }
            }
        }
        // init data
        if (result==null){
            result = {};
        }
        cache[key] = result;
        // return
        return result;
    };
})();
cant read file /Users/liufang/Documents/program/site/Hexo/public/src/javascript/base/module.js for utf-8, cause:
{"errno":-2,"code":"ENOENT","syscall":"open","path":"/Users/liufang/Documents/program/site/Hexo/public/src/javascript/base/module.js"}
I$('e8f003fdc9fc985cd7179f5b748647a6',function (_k, _m, _bm, _e, _v, _t, _p) {

    var _pro;

    // 扩展模块基类
    _p._$$MainModule = _k._$klass();
    _pro = _p._$$MainModule._$extend(_bm._$$Module);

    // 对于顶级模块, 可以重写__doParseParent方法
    // 确定整个应用的父容器.
    // 这里的module-box是容器的id.
    _pro.__doParseParent = function(options) {
        return _e._$get('module-box');
    }

    // 模块构建阶段
    // this.__body确定模块的html结构, 取出模板的html资源即可.
    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('nav'));

    }

    // 模块的显示
    _pro.__onShow = function(options) {
        // 除非你有自己的显示方式
        // 否则一定要调用父类方法
        // 此外options参数不要漏掉
        this.__super(options);

        // magic code
    }

    // 模块刷新
    _pro.__onRefresh = function(options) {
        this.__super(options);

        // magic code
    }

    // 其他 __onHide 等等

    // 监听document的templateready事件, 注册组件.
    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('m', _p._$$MainModule);
    });
},'2fbfae3d7496e6e53b8961c6489391be','e21dd2ffb87a839bf9869e2e487e98a5','4059c6da72ac0be2ee9e06108c611742','e4b03095d808a12c206226daab1ba095','39ca648dc8440d1bdcb8240e2650f086','a6a6fdac1f5db5b35a4a806a57f343ea');