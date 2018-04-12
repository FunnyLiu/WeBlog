define([
    'regular!./childrenBoy.html',
    '{pro}common/ui/base.js'
], function(
    _tpl,
    _base
){
    var _g = window;
    var boyUI = _base.extend({
        name:'childrenBoy',
        template:_tpl,
        /*设置初始值*/
        config:function(){

        }
    });

    return boyUI;
});