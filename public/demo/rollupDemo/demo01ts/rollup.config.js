import typescript from 'rollup-plugin-typescript';

export default {
    input:'./src/test.ts',
    output:{
        'format':'umd',
        'file':'./dist/test.js'
    },
    plugins:[
        //配置参数见 http://www.typescriptlang.org/docs/handbook/compiler-options.html
        typescript({
            module:"ES6",
            target:"ES5"
        })
    ]
}