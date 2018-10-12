const program = require('commander');
const exec = require('child_process').exec;

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


let child = exec(Config[cmdName], {
    maxBuffer: 1024 * 1024
});

child.stdout.on('data', function(data) {
    console.log(data);
});
child.stderr.on('data', function(data) {
    console.log(data);
});
child.on('close', function(code) {
    console.log('done!');
});