
NEJ.define([
        '{lib}base/klass.js',
        '{lib}util/event.js'
    ],
    function(
        _klazz,
        _event,
        _p, _pro){

        _p._$$Store = _klazz._$klass();
        _pro = _p._$$Store._$extend(_event._$$EventTarget);

        _pro.__init = function(){
            this.__super();
            // 缓存正在请求的异步action
            this.__onLoadingActionMap = {};
        };

        _pro.__reset = function(_options){
            this.__super(_options);
        };

        _pro._$dispatch = function(_action){
            if(this.__onLoadingActionMap[_action.type]){
                return false;
            }

            this.__onLoadingActionMap[_action.type] = _action;

        };

        // 子类实现
        _pro.__callBack = function(_action, _data){
            delete this.__onLoadingActionMap[_action.type];

        };
        //深拷贝
        _pro.__deepCopy = function(p,c){
            var __that = this;
            var c = c || {};
            for(var i in p){
                var reg = /\$/g;
                if(reg.test(i)){

                }else{
                    if(typeof p[i] === "object"){
                        c[i] = (p[i].constructor === Array)?[]:{};
                        __that.__deepCopy(p[i],c[i]);
                    } else {
                        c[i] = p[i];
                    }
                }

            }
            return c;
        };

        _pro.__copyData = function(){
            return this.__deepCopy(this.__data);
        };

        // 触发更新
        _pro.__reducer = function(){
            // clone
            this._$dispatchEvent('onUpdate', this.__copyData());
        };

        // 触发更新
        _pro.__reducer2 = function(_action){
            // clone
            this._$dispatchEvent('onUpdate', this.__copyData(), _action);
        };

        // 注册监听
        _pro._$subscribe = function(_listener){
            this._$addEvent('onUpdate', _listener);
        };
        // 解绑注册监听,注意如果_$bind()传入的函数，清除不了，因为是返回一个新函数
        _pro._$unSubscribe = function(_listener){
            this._$delEvent('onUpdate', _listener);
        };
        // 解绑所有注册监听
        _pro._$clearSubscribe = function(){
            this._$clearEvent('onUpdate');
        };

        // 获取数据
        _pro._$getData = function(){
            return this.__data;
        };

        //_pro._$once = function(_key, _listener){
        //    this.__onceMap = this.__onceMap || {};
        //    this.__onceMap[_key] = 1;
        //
        //    this._$addEvent('onUpdate', _listener);
        //};

        // 子模块 注册监听 并且首先调用一次
        _pro._$subscribe2 = function(_listener, _action) {
            this._$addEvent('onUpdate', _listener);
            var _data = this.__copyData();
            _listener(_data, _action);
        };

        // 清除data，或者恢复到初始值
        _pro._$resetData = function(_data){
            if(this.__initData){
                this.__data = this.__deepCopy(this.__initData);
            }else{
                this.__data = {}
            }
        }
    });
