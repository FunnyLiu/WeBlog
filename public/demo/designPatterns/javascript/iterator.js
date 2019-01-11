/**
 * 迭代器模式
 * 包含某种数据集合的对象，对外提供一种简单的方法能够访问数据结构中每个元素。
 * 消费者不需要知道如何组织数据
 * 通常有个next方法，返回下一结果
 * 
 */
'use strict';

var agg = (function(){
    var index = 0,
        data = [1,2,3,4,5],
        length = data.length;

    return {
        //下一结果
        next: function() {
            var element;
            if(!this.hasNext()){
                return null;
            }
            element = data[index];
            index = index + 1;
            return element;
        },
        //判断是否结尾
        hasNext: function(){
            return index < length;
        },
        //指针初始化
        rewind: function(){
            index = 0;
            return 'rewind';
        },
        //当前节点
        current: function(){
            index = index?index-1:0;
            return data[index];
        }

    }
}());


//测试用例
console.log(agg.next());    //1
console.log(agg.next());    //2
console.log(agg.next());    //3    
console.log(agg.current()); //3
console.log(agg.hasNext()); //true
console.log(agg.rewind());  //rewind
console.log(agg.current()); //1
