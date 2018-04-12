
NEJ.define([
    '{lib}base/klass.js',
    '{pro}base/store.js'
], function(
    _klazz,
    _store,
    _p, _pro){


    _p._$$Store = _klazz._$klass();
    _pro = _p._$$Store._$extend(_store._$$Store, true);

    _pro.__init = function(){
        this.__super();

        // 课件播放页的全部数据
        this.__data = {
            todos:[
                {completed: true, description: "sleep" },
                {completed: false, description: "work" },
                {completed: true,description:"play"}
            ],
            editTodo:'',
            filter:'all',
            activeLength:0,
            completedLength:0,
        };

        this.__updateData();
    };

    _pro.__updateData = function(){
        this.__initData = this.__copyData();
    };

    _pro.__reset = function(_options){
        this.__super(_options);
    };

    // 具体的数据操作
    _pro._$dispatch = function(_action){
        var _data = _action.data;

        switch(_action.type){
            case 'SET_ACTIVELENGTH':
                this.__data.activeLength = this.__data.todos.filter(function(item){
                    return item.completed == false;
                }).length;
                this.__reducer();
                break;
            case 'SET_COMPLETEDLENGTH':
                this.__data.completedLength = this.__data.todos.filter(function(item){
                    return item.completed == true;
                }).length;
                this.__reducer();
                break;
            case 'ADD_TODO':
                this.__data.todos.unshift({
                    description:_data,
                    completed:false
                });
                this.__data.editTodo = "";
                this.__reducer();
                break;
            case 'SET_VISIBILITY':
                if(!!_data){
                    var _nowTodos = this.__initData.todos;
                    if(_data !='all'){
                        var _filterData = _nowTodos.filter(function(item){
                            return _data == 'completed'?item.completed:!item.completed;
                        });
                        this.__data.todos = _filterData;
                    }else{
                        this.__data.todos = _nowTodos;
                    }
                    this.__data.filter = _data;
                }
                this.__reducer();
                break;
            case 'CLEAR_COMPLETED':
                this.__data.todos = this.__data.todos.filter(function(item) {
                    return !item.completed
                });
                this.__reducer();
                break;
            case 'TOGGLE_ALL':
                this.__data.todos.forEach(function(item){
                    return item.completed = !item.completed;
                });
                this.__reducer();
            case 'REMOVE_TODO':
                this.__data.todos.splice(_data,1);
                this.__reducer();
                break;
            case 'TOGGLE_TODO':
                this.__data.todos[_data].completed = !this.__data.todos[_data].completed;
                this.__reducer();
                break;
            default:

        }



    };



    return _p._$$Store._$getInstance();
});
