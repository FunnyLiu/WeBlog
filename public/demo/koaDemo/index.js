const Koa = require('koa');
const app = new Koa();

const logger = require('./middleware/logger');
const compose = require('./middleware/compose');

//一个简单的响应
// app.use(ctx => {
//     ctx.body = 'hello world';
// });

//中间件next执行顺序，可以理解为前端的捕获和冒泡
// app.use(async(ctx, next)=>{
//     //1
//     const start = Date.now();
//     //2
//     await next();
//     //8
//     const ms = Date.now() - start;
//     //9
//     ctx.set('X-Response-Time',`${ms}ms`);
// });

// app.use(async(ctx,next)=>{
//     //3
//     const start = Date.now();
//     //4
//     await next();
//     //6
//     const ms = Date.now() - start;
//     //7
//     console.log(`${ctx.method} ${ctx.url} - ${ms}`);
// });

// app.use(async ctx=>{
//     //5
//     ctx.body = 'hello world';
// });


//使用一个封装的简单中间件logger,刷新页面即可看到请求方式
app.use(logger());

//使用一个组件的中间件
//访问http://localhost:3000/backwards 或者 http://localhost:3000/random
app.use(compose);


//开启端口监听
app.listen(3000);