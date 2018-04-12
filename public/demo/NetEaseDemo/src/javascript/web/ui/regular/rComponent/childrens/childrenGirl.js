define([
    'regular!./childrenGirl.html',
    '{pro}common/ui/base.js'
], function(
    _tpl,
    _base
){
    var _g = window;
    var girlUI = _base.extend({
        name:'childrenGirl',
        template:_tpl,
        /*设置初始值*/
        config:function(){

        }
    });

    return girlUI;
});