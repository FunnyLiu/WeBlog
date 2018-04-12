define([
	'regular!./todolist.html',
	'{pro}ui/regular/todomvcStore/todoitem/todoitem.js',
	'{pro}common/ui/base.js',
    '{pro}store/regular/todomvcStore/action.js'
], function(
	_tpl,
	_todoitem,
	_base,
    _action
) {
	var _g = window;
	var todolistUI = _base.extend({
		name: 'todolist',
		template: _tpl,

        config:function(){
             _action._$setActiveLength();
             _action._$setCompletedLength();
        },
        setVisibility: function(filter) {
			 _action._$setVisibility(filter);
             _action._$setActiveLength();
             _action._$setCompletedLength();
		},
		// toggle all todo's completed state
		toggleAll: function() {
            _action._$toggleAll();
            _action._$setActiveLength();
            _action._$setCompletedLength();
		},
		// clear all compleled
		clearCompleted: function() {
            _action._$clearCompleted();
            _action._$setCompletedLength();
		},
		// create a new todo
		newTodo: function(editTodo) {
            _action._$addNewTodo(editTodo);
            _action._$setActiveLength();
            _action._$setCompletedLength();
		},
        removeTodo:function(index){
            _action._$removeTodo(index);
            _action._$setActiveLength();
            _action._$setCompletedLength();
        }
	});

	return todolistUI;
});