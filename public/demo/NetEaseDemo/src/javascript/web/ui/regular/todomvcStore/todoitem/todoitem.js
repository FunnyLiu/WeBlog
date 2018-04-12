define([
    'regular!./todoitem.html',
    '{pro}common/ui/base.js',
    '{pro}store/regular/todomvcStore/action.js'
], function(
    _tpl,
    _base,
    _action
){
    var _g = window;
    var todoitemUI = _base.extend({
        name:'todoitem',
        template:_tpl,
        toggleTodo:function(index){
            _action._$toggleTodo(index);
            _action._$setActiveLength();
            _action._$setCompletedLength();
        }
    });

    return todoitemUI;
});