/**
 * 装饰者模式
 * 
 * 装饰者模式中，可以在运行时动态添加附加功能到对象中。
 * 处理静态类时这是一个挑战，但js中对象是可变的。
 * 
 * 装饰者一个比较方便的特征在于其预期行为的可定制和可配置特性。
 * 一步一步增强一个对象
 * 
 * 
 * 使用列表实现
 * 这种实现利用了js语言的动态特性，
 * 使用这种实现方式，还有轻松实现反装饰，也就是从装饰者列表从移除项目。
 * 
 * @param {} price 
 */
function Sale(price) {
    this.price = (price > 0) || 100;
    //装饰者列表
    this.decorators_list = [];
}

/**
 * 具体的业务装饰方法
 */
Sale.decorators = {};
Sale.decorators.fedtax = {
    getPrice: function (price) {
        return price + price * 5 / 100;
    }
};
Sale.decorators.quebec = {
    getPrice: function (price) {
        return price + price * 7.5 / 100;
    }
};
Sale.decorators.money = {
    getPrice: function (price) {
        return '$' + price.toFixed(2);
    }
};
/**
 * decorate方法仅仅用于追加列表
 */
Sale.prototype.decorate = function (decorator) {
    this.decorators_list.push(decorator);
};
/**
 * getPrice方法较为复杂，
 * 遍历当装饰器并调用他们的同名方法，
 * 将值传递进入
 */
Sale.prototype.getPrice = function () {
    var price = this.price,
        i,
        max = this.decorators_list.length,
        name;
    for (i = 0; i < max; i++) {
        name = this.decorators_list[i];
        price = Sale.decorators[name].getPrice(price);
    }
    return price;
};


/**
 * 使用es6进行封装
 */
'use strict';
class Sale2 {
    constructor(price) {
        [this.decoratorsList, this.price] = [[], price];
    }

    decorate(decorator) {
        if (!Sale2[decorator]) throw new Error(`decorator not exist: ${decorator}`);
        this.decoratorsList.push(Sale2[decorator]);
    }

    getPrice() {
        for (let decorator of this.decoratorsList) {
            this.price = decorator(this.price);
        }
        return this.price.toFixed(2);
    }

    static quebec(price) {
        return price + price * 7.5 / 100;
    }

    static fedtax(price) {
        return price + price * 5 / 100;
    }
}



//测试用例

var sale = new Sale(100);       //初始价格
sale.decorate('fedtax');        //增加联邦税
sale.decorate('quebec');        //增加省级税
sale.decorate('money');         //转化格式为美元
console.log(sale.getPrice());   //$1.13

var sale2 = new Sale2(100);       //初始价格
sale2.decorate('fedtax');        //增加联邦税
sale2.decorate('quebec');        //增加省级税
console.log(sale2.getPrice());   //111.28