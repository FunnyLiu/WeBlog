/**
 * Created by liufang on 2017/1/6.
 */
//{ type: 'ADD_TODO', text: 'Go to swimming pool' }
//{ type: 'TOGGLE_TODO', index: 1 }
//{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
NEJ.define([
    '{pro}store/regular/todomvcStore/store.js'
], function(
    _store,
    _p){

    _p._$addNewTodo = function(_data){
        _store._$dispatch({
            type:'ADD_TODO',
            data:_data
        });
    };
    _p._$toggleTodo = function(_data){
        _store._$dispatch({
            type:'TOGGLE_TODO',
            data:_data
        })
    };
    _p._$toggleAll = function(_data){
        _store._$dispatch({
            type:'TOGGLE_ALL',
            data:_data
        });
    };
    _p._$setVisibility = function(_data){
        _store._$dispatch({
            type:'SET_VISIBILITY',
            data:_data
        });
    };
    _p._$setActiveLength = function(_data){
        _store._$dispatch({
            type:'SET_ACTIVELENGTH',
            data:_data
        })
    };
    _p._$setCompletedLength = function(_data){
        _store._$dispatch({
            type:'SET_COMPLETEDLENGTH',
            data:_data
        })
    };
    _p._$clearCompleted = function(_data){
        _store._$dispatch({
            type:'CLEAR_COMPLETED',
            data:_data
        })
    };
    _p._$removeTodo = function(_data){
        _store._$dispatch({
            type:'REMOVE_TODO',
            data:_data
        })
    }

});


