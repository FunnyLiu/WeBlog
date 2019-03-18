import bundle from './a.bundle.js';

let loaderNode = document.querySelector('#j-loader');
loaderNode.addEventListener('click',()=>{
  bundle((file) => {
    document.open();
    document.write('<h1>' + file + '</h1>');
    document.close();
  });
},false)