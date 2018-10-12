
/**
 * Promise本质上是状态机，三种状态，
 * 初始为pedding
 * 成功为fulfilled
 * 失败为rejected
 */
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * Promise接收一个executor函数作为参数
 * @param {Function} executor 
 */
function MyPromise(executor) {
  let self = this;
  self.state = PENDING;


  function resolve(value) {
    if (self.state === PENDING) {
      self.state = FULFILLED;
    }
  }

  function reject(reason) {
    if (self.state === PENDING) {
      self.state = REJECTED;
    }
  }
  /**
   * executor函数有两个参数resolve和reject，
   * 且运行在try-catch中
   */
  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

module.exports = MyPromise;