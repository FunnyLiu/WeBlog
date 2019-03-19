
    
let EventBus = function() {
    //订阅对象
    const subscriptions = { };
  
    //订阅
    this.subscribe = (eventType, callback)=> {
      const id = Symbol('id');
      //初始化订阅对象，将id指向回调函数
      if (!subscriptions[eventType]) subscriptions[eventType] = { };
      subscriptions[eventType][id] = callback;
      return {
        //返回取消订阅的方法
        unsubscribe: function unsubscribe() {
          delete subscriptions[eventType][id];
          if (Object.getOwnPropertySymbols(subscriptions[eventType]).length === 0) {
            delete subscriptions[eventType];
          }
        },
      };
    };
    
    //发布
    this.publish = (eventType, arg)=> {
      if (!subscriptions[eventType]) return;
        
      //拿到对应的订阅者，指向挂载的回调函数
      Object.getOwnPropertySymbols(subscriptions[eventType])
        .forEach(key => subscriptions[eventType][key](arg));
    };
  }
  
  export default EventBus;