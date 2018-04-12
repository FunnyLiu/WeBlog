define([
    'regular!./childrenBaby.html',
    '{pro}common/ui/base.js'
], function(
    _tpl,
    _base
){
    var _g = window;
    var BabyUI = _base.extend({
        name:'childrenBaby',
        template:_tpl,
        /*设置初始值*/
        config:function(){

        }
    });

    return BabyUI;
});