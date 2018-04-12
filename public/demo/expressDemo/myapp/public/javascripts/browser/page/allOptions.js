/**
 * Created by liufang on 2017/7/18.
 */
define(['jquery','regular'],function(jq,Regular){
    var btn1Node = jq('.j-btn1');

    btn1Node.on('click',function(){
        window.open('//study.163.com');
    });

    var btn2Node = jq('.j-btn2');
    btn2Node.on('click',function(){
        jq.ajax({
            url: '/browser/getHref',
            success:function(data){
                if(!!data && data.result == 1){
                    window.open(data.data.url||'');
                }
            }
        })
    });

    var btn3Node = jq('.j-btn3');
    btn3Node.on('click',function(){
        jq.ajax({
            url: '/browser/getHref',
            async:false,
            success:function(data){
                if(!!data && data.result == 1){
                    window.open(data.data.url||'');
                }
            }
        })
    });
});