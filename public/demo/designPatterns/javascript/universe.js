//单例模式
//https://codepen.io/brizer/pen/majpaL?editors=0010
//将构造函数和实例包装在即时函数中，利用私有变量instance指向该对象。
var Universe;

(function(){
    var instance;

    Universe = function Universe(){

        if(instance){
            return instance;
        }

        instance = this;

        //功能呢
        this.name = 'lf';
        
    }
}());

//通过重写构造函数
function Universe2(){
    //缓存实例
    var instance;
    //重写构造函数
    Universe2 = function(){
        return instance;
    }
    //保留原型属性，如果不保留，实例化后第二次的增加原型均会失效
    Universe2.prototype = this;
    //实例
    instance = new Universe2();
    //重置构造函数指针
    instance.constructor = Universe2;

    //具体业务功能呢
    instance.name = 'lf';

    return instance;
}

//通过es6的语法进行封装
let _instance = (function () {
    let instance;
    //如果传入，则初次实例化
    return (newInstance) => {
      if (newInstance) instance = newInstance;
      return instance;
    }
  }());
  
  class Universe3 {
    constructor() {
      if (_instance()) return _instance();
      //功能呢
      this.name = 'lf';
      _instance(this);
    }
  }



//测试用例
var uni1 = new Universe();
var uni2 = new Universe();
console.log(uni1 === uni2); //true

var uni3 = new Universe2();
var uni4 = new Universe2();
console.log(uni3 === uni4); //true

var uni5 = new Universe3();
var uni6 = new Universe3();

console.log(uni5 === uni6); //true