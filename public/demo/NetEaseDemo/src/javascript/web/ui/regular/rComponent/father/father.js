define([
    'regular!./father.html',
    '{pro}common/ui/base.js'
], function(
    _tpl,
    _base
){
    var _g = window;
    var fatherUI = _base.extend({
        name:'father',
        template:_tpl,
        /*设置初始值*/
        config:function(){

        },
        init:function(){

        },
        destroy:function(){
            this.supr();
        },
        getChildren:function(_name){
            return _name;
        },
        chooseChildren:function(){
            this.$emit('chooseChildren');
        }
    });

    return fatherUI;
});