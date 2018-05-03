//中间件创作实践，创建公共中间件时，将中间件包装在接受参数的函数中，允许用户扩展功能。
//即使我们的中间件不接受任何参数，遵循该规则

function logger(format){
    format = format || ':method ":url"';
    return async function logger(ctx, next){
        const str = format
            .replace(':method',ctx.method)
            .replace(':url',ctx.url);

        console.log(str);

        await next();
    };
}


module.exports = logger;
