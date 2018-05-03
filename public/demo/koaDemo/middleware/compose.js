//使用koa-compose，将多个中间件组合成一个单一的中间件，便于重用或导出
const compose = require('koa-compose');

async function random(ctx, next){
    if('/random' == ctx.path){
        ctx.body = Math.floor(Math.random() *10);
    }else{
        await next();
    }
};


async function backwards(ctx, next) {
    if ('/backwards' == ctx.path) {
      ctx.body = 'sdrawkcab';
    } else {
      await next();
    }
  };
  
async function pi(ctx, next) {
    if ('/pi' == ctx.path) {
        ctx.body = String(Math.PI);
    } else {
        await next();
    }
};

const all = compose([random, backwards, pi]);

module.exports = all;