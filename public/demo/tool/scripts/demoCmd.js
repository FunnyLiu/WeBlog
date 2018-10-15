const program = require('commander');
const exec = require('child_process').exec;
const shell = require('shelljs');

// 命令行参数配置
program
    .version('0.0.1')
    .option('-n, --name <value>', 'cmd name')
    .parse(process.argv);


const Config = {
    //运行promise的demo
    'myPromise':'node public/demo/nodeDemo/promise/test.js'
}

let cmdName;



if(!!program.name){
    cmdName = program.name;
}else{
    console.error("need cmdName!");
    process.exit(1);
}

if (shell.exec(Config[cmdName]).code !== 0) {
    shell.echo('Error: Wrong');
    shell.exit(1);
}
