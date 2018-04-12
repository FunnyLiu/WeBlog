NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{pro}base/module.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js',
    '{pro}ui/regular/rComponent/father/father.js',
    '{pro}ui/regular/rComponent/childrens/childrenBaby.js',
    '{pro}ui/regular/rComponent/childrens/childrenBoy.js',
    '{pro}ui/regular/rComponent/childrens/childrenGirl.js'
], function(
    _k,
    _m,
    _bm,
    _e,
    _v,
    _t,
    _fatherUI,
    _p) {

    var _pro;
    var _prof;
    // 扩展模块基类
    _p._$$RegularRComponentModule = _k._$klass();
    _pro = _p._$$RegularRComponentModule._$extend(_bm._$$Module);

    // 对于顶级模块, 可以重写__doParseParent方法
    // 确定整个应用的父容器.
    // 这里的module-box是容器的id.
    _pro.__doParseParent = function(options) {
        return _e._$get('regular-content');
    }

    // 模块构建阶段
    // this.__body确定模块的html结构, 取出模板的html资源即可.
    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('regular-rComponent'));

    }

    // 模块的显示
    _pro.__onShow = function(options) {
        // 除非你有自己的显示方式
        // 否则一定要调用父类方法
        // 此外options参数不要漏掉
        this.__super(options);

        var _index = 0;
        var _state = [
            {
                'name':'childrenBaby',
                'age':2
            },{
                'name':'childrenBoy',
                'age':20
            },{
                'name':'childrenGirl',
                'age':18
            }
        ];
        if(!!this._fatherUI){
            this._fatherUI = null;
        }
        this._fatherUI = new _fatherUI({
            data:{
                'state':_state[_index]
            }
        }).$inject('#rComponent');
        //切换state中的数据,调用不同子组件并传参
        this._fatherUI.$on('chooseChildren',function(){
            _index++;
            if(_index == 3){
                _index = 0;
            }
            this.data.state = _state[_index];
            this.$update();
        })
    }

    // 模块刷新
    _pro.__onRefresh = function(options) {
        this.__super(options);

        // magic code

    };

    // 其他 __onHide 等等
    _pro.__onHide = function(){
        this.__super();
        if(!!this._fatherUI){
            this._fatherUI = this._fatherUI.destroy();
        }
    };
    // 监听document的templateready事件, 注册组件.
    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('/regular/rComponent', _p._$$RegularRComponentModule);
    });
});