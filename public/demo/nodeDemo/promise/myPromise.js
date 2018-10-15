
/**
 * 2. Promise本质上是状态机，三种状态，
 * 初始为pedding
 * 成功为fulfilled
 * 失败为rejected
 */
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * 1. Promise接收一个executor函数作为参数
 * @param {Function} executor
 */
function MyPromise(executor) {
  let self = this;
  //2.1 对状态机状态进行处理
  self.state = PENDING;
  //3. 新增正常值value和失败原因reson，用来封装then方法
  self.value = null;
  self.reason = null;
  //4. 增加异步调用队列
  self.onFulfilledCallbacks = [];
  self.onRejectedCallbacks = [];


  function resolve(value) {
      if (self.state === PENDING) {
            self.state = FULFILLED;
            //3.1 给成功值赋值
            self.value = value;
            //4.1 成功后回调队列
            self.onFulfilledCallbacks.forEach(function(fulfilledCallback) {
                fulfilledCallback();
            });
      }
  }

  function reject(reason) {
    if (self.state === PENDING) {
        self.state = REJECTED;
        //3.2 给失败原因赋值
        self.reason = reason;
        //4.2 失败时回调队列
        self.onRejectedCallbacks.forEach(function(rejectedCallback) {
            rejectedCallback();
        });
    }
  }
  /**
   * 1.1 executor函数有两个参数resolve和reject，
   * 且运行在try-catch中
   */
  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

//3.3 封装then方法
MyPromise.prototype.then = function(onFuifilled, onRejected){
    let self = this;

    //4.3 在准备阶段,将对应的方法加入回调队列中
    if (self.state === PENDING) {
        self.onFulfilledCallbacks.push(() => {
            onFuifilled(self.value);
        });
        self.onRejectedCallbacks.push(() => {
            onRejected(self.reason);
        });
    }


    //3.4 如果成功则调用下一个promise的resolve
    if (self.state === FULFILLED) {
        onFuifilled(self.value);
    }
    //3.5 如果失败则调用下一个promise的reject
    if (self.state === REJECTED) {
        onRejected(self.reason);
    }
};


module.exports = MyPromise;


