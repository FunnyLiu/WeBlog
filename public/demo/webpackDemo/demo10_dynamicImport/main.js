


let ensureNode = document.querySelector('#j-ensure');
let importNode = document.querySelector('#j-import');
ensureNode.addEventListener('click',()=>{
  //通过requie.ensure来动态加载其他js文件
  require.ensure(['./a'], function(require) {
    var content = require('./a');
    //异步加载的js
    document.open();
    document.write('<h1>' + content + '</h1>');
    document.close();
  });
},false)

importNode.addEventListener('click',()=>{
  //通过import的方式调用热加载，指定webpackChunkName后加载文件从0.bundle.js变为a.bundle.js
  //import为promise的方式
  return import(/* webpackChunkName: "a" */ './a').then(({default:_}) => {
      //异步加载的js
      document.open();
      document.write('<h1>' + _ + '</h1>');
      document.close();
  }).catch(error => 'An error occurred while loading the conntent');
},false)
