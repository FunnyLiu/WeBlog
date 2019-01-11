/**
 * 策略模式
 * 
 * 在运行时选择算法，从多个算法中选择用于处理特定任务的算法
 * 
 */
'use strict';
var validator = {
    //所有可用的检查
    types: {},
    //错误消息列表
    messages: [],
    //验证类型配置
    config:{},
    //具体的校验方法
    validate: function(data){
        var i ,msg ,type,checker,result_ok;

        this.messages = [];

        for(i in data){
            if(data.hasOwnProperty(i)){
                type = this.config[i];
                checker = this.types[type];

                if(!type){
                    continue;
                }
                if(!checker){
                    console.warn('no hander to validate type'+type);
                }

                result_ok = checker.validate(data[i]);

                if(!result_ok){
                    msg = 'invalid value for *'+i+'*, '+checker.instructions;
                    this.messages.push(msg);
                }
            }
        }

        return this.hasErrors();

    },

    hasErrors: function(){
        return this.messages.length !==0;
    }

};
//具体的检查类型
validator.types.isNonEmpty = {
    validate:function(value){
        return value !=='';
    },
    instructions: 'the value cannot be empty'
};
validator.types.isNumber = {
    validate:function(value){
        return !isNaN(value);
    },
    instructions:'the value can only be a valid number'
}


/**
 * 使用es6封装
 */
class Checker {
    constructor(check, instructions) {
        [this.check, this.instructions] = [check, instructions];
    }
}
class Validator2 {
    constructor(config) {
        [this.config, this.messages] = [config, []];
    }

    validate(data) {
        for (let [k, v] of data.entries()) {
            let type = this.config.get(k);
            let checker = Validator2[type];
            if (!type) continue;
            if (!checker) throw new Error(`No handler to validate type ${type}`);
            let result = checker.check(v);
            if (!result) this.messages.push(checker.instructions + ` **${v}**`);
        }
    }

    hasError() {
        return this.messages.length !== 0;
    }
}
Validator2.isNumber = new Checker((val) => !isNaN(val), 'the value can only be a valid number');
Validator2.isNonEmpty = new Checker((val) => val !== "", 'the value can not be empty');






/**
 * 测试用例
 */
validator.config = {
    name:'isNonEmpty',
    age:'isNumber'
}

var data = {
    name:'',
    age:'as'
}
validator.validate(data);
if(validator.hasErrors()){
    console.warn(validator.messages.join('\n'));
    //invalid value for *name*, the value cannot be empty
    // invalid value for *age*, the value can only be a valid number
}


let data2 = new Map([['first_name', ''], ['age', 'as']]);
let config2 = new Map([['first_name', 'isNonEmpty'], ['age', 'isNumber']]);
let validator2 = new Validator2(config2);
validator2.validate(data2);
console.warn(validator2.messages.join('\n'));