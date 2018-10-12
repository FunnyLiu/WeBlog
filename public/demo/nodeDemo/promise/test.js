let MyPromise = require('./myPromise.js');

let promise = new MyPromise((resolve,reject)=>{
    resolve(123);
    console.log('hehe');
})