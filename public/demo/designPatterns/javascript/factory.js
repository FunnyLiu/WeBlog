//工厂模式
//工厂模式的目的是为了创建对象，具体以下目标：
//1.当创建相似对象时执行重复操作。
//2.在编译时不知道具体类型（类）的情况下，为工厂客户提供一种创建对象的接口。
'use strict';

//父构造函数
function CarMaker(){

}
//父构造函数的 功能方法
CarMaker.prototype.drive = function(){
    console.log('vroom, i have ' + this.doors + ' doors');
}

//static静态工程方法
CarMaker.factory = function(type){
    var constr = type,
        newcar;
    //如果构造函数不存在，则发生错误
    if(typeof CarMaker[constr] !== 'function'){
        throw {
            name:'Error',
            message: constr + 'does not exist'
        };
    }
    //构造函数是已知存在的，
    //原型继承父类，但仅继承一次
    if(typeof CarMaker[constr].prototype.drive !== 'function'){
        CarMaker[constr].prototype = new CarMaker();
    }
    //创建一个新的实例
    newcar = new CarMaker[constr]();
    //可选择性的调用一些方法然后返回
    return newcar;
};
//定义特定的汽车制造商
CarMaker.Compact = function(){
    this.doors = 4;
};

CarMaker.Convertible = function(){
    this.doors = 2;
};

CarMaker.SUV = function(){
    this.doors = 24;
};



//使用es6的方式封装，会发现简洁了很多
class CarMaker2 {
    constructor() {
        this.doors = 0;
    }

    drive() {
        console.log(`lf, i have ${this.doors} doors`);
    }

    static factory(type) {
        return new CarMaker2[type]();
    }
}

CarMaker2.Compact = class Compact extends CarMaker2 {
    constructor() {
        super();
        this.doors = 4;
    }
};
  



//测试用例
//工厂方法接受在运行时以字符串形式指定的类型，然后创建并返回所请求类型的对象。
//所以代码中是看不到任何具有new或者对象字面量的构造函数。
//js内置的工厂模式应用可以参考Object：
//如果传递数字，他会以Number创建对象；
//布尔值和字符串也统一成立。
var o = new Object(),
    n = new Object(1),
    s = new Object('1'),
    b = new Object(true);


var conrolla = CarMaker.factory('Compact');
var solstice = CarMaker.factory('Convertible');
var cherokee = CarMaker.factory('SUV');


conrolla.drive();//vroom, i have 4 doors
solstice.drive();//vroom, i have 2 doors
cherokee.drive();//vroom, i have 24 doors


CarMaker2.factory('Compact').drive(); // lf, i have 4 doors