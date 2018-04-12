
NEJ.define([
    '{lib}base/klass.js',
    'base/element',
    '{lib}util/dispatcher/module.js'
], function(_k, _e, _t, _p) {

    var _pro;

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t._$$ModuleAbstract);
    /**
     * 模块构建，主要构建模块节点及属性
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    _pro.__doBuild = function(_options){
        //this.__buildFuncPoints();
    };
    /**
     * 模块的初始化和功能点
     * @return {String}
     */
    _pro.__buildFuncPoints = function(){

    };
    _pro.__onShow = function(options) {
        this.__super(options);
        // magic
    }
	_pro.__onHide = function(){
        _e._$removeByEC(this.__body);
    };
    return _p;

});