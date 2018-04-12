var htmlNode = document.querySelector('.u-html')||'';
var jsNode = document.querySelector('.u-js')||'';
var cssNode = document.querySelector('.u-css')||'';
var hidBtnNode = document.querySelector('.m-code_hidBtn')||'';
var codeContent = document.querySelector('.m-code_content')||'';
var codeNode = document.querySelector('.m-code')||'';
var htmlEditor = {};
var jsEditor = {};
var cssEditor = {};
if(typeof CodeMirror != 'undefined'){
    if(htmlNode){
        htmlEditor = CodeMirror.fromTextArea(htmlNode, {
            lineNumbers: true,
            mode: "xml",
            indentUnit: 4,
            indentWithTabs: true,
            htmlModel:true,
            theme:"base16-dark"

        });
    }
    if(jsNode){
        jsEditor = CodeMirror.fromTextArea(jsNode, {
            lineNumbers: true,
            mode: "javascript",
            indentUnit: 4,
            indentWithTabs: true,
            theme:"base16-dark"

        });
    }
    if(cssNode){
        cssEditor = CodeMirror.fromTextArea(cssNode, {
            lineNumbers: true,
            mode: "css",
            indentUnit: 4,
            indentWithTabs: true,
            theme:"base16-dark"

        });

    }

}

//处理底部隐藏按钮相关逻辑
if(hidBtnNode){
    hidBtnNode.addEventListener('click',function(){
        if(codeContent.style.display == 'none'){
            codeContent.style.display = 'flex';
            hidBtnNode.style.bottom = '400px';

        }else{
            codeContent.style.display = 'none';
            hidBtnNode.style.bottom = '0';
        }

    },false);
    //兼容之前没有底部按钮时的样式
    if(codeNode){
        codeNode.style.display = 'block';
    }
}