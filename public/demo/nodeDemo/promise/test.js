//1. 封装Promise
let MyPromise = require('./myPromise.js');

//2. 新增状态机
let promise = new MyPromise((resolve,reject)=>{
    console.log('state');
    resolve(123);
});
/**
 * 控制台结果为
 * state
 * value: 123
 */
//3. 封装then方法
promise.then((value) => {
    console.log(`value: ${value}`);
}, (reason) => {
    console.log(`reason: ${reason}`);
});

/**
 * 控制台结果为
 * state
 * value: 123
 * value1: 1234
 * value2: 1234
 */
//4. 异步调用及多个then时
let promiseAsync = new MyPromise(function(resolve, reject) {
    setTimeout(function() {
        resolve(1234);
    }, 1000);
});
promiseAsync.then(function(value) {
    console.log('value1', value);
}, function(reason) {
    console.log('reason1', reason);
});

promiseAsync.then(function(value) {
    console.log('value2', value);
}, function(reason) {
    console.log('reason2', reason);
});


//5.1 then连接

/**
 * 控制台结果为
 * state
 * value: 123
 * value1: 123
 * value2: 456
 */
let promiseChain = new Promise((resolve, reject) => {
        resolve(123);
});

promiseChain.then((value) => {
    console.log('value1', value);
    return 456;
}).then((value) => {
    console.log('value2', value);
});

//5.2 异常捕获
/**
 * 控制台结果为
 * state
 * value: 123
 * value1: 123
 * value2: 456
 */

let promiseError = new Promise((resolve, reject) => {
        resolve(123);
});

promiseError.then((value) => {
    console.log('value1', value);
    a.b = 2;    // 这里存在语法错误
    return 456;
}).then((value) => {
    console.log('value2', value);
}, (reason) => {
    console.log('reason2', reason);
});

