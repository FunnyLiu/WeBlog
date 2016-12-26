---
title: 第一个Regular的UI开发
date: 2016-08-24 17:48:20
categories: "Regular"
---

# **前言**

这次迭代，终于用到了公司自己的框架--Regular。确实很方便啊。
[指引文档](http://regularjs.github.io/guide/zh/index.html),[API](http://regularjs.github.io/reference/?api-zh),[模板语法](http://regularjs.github.io/reference/?syntax-zh)

这里就不做广告了，主要是记录自己使用该框架的经验，方便日后查阅和对比改进。

---

# **一个UI**


将组件完整代码贴出：

``` javascript
/*
 * --------------------------------------------
 * 微专业详情页课程信息UI
 * @version  1.0
 * @author   hzliufang(hzliufang@corp.netease.com)
 * --------------------------------------------
 */

var f = function() {
    var u = NEJ.P('nej.u'),
        eu = NEJ.P('edu.u'),
        r = NEJ.P('edu.r'),
        e = NEJ.P('nej.e'),
        d = NEJ.P('edu.d'),
        v = NEJ.P('nej.v'),
        g = window;
/*定义结构模板*/
var _template = '<div class="m-courseDetail-lists f-mfc">\
			{#list lists as item}\
			<div class="item">\
				<div class="content" on-click={this.toggleShow(item_index,item.isShow)}>\
					<div class="icon f-ib  f-icon icon-num-{item_index+1}"></div>\
					<div class="title f-ib">\
						<p class="name">{item.name}</p>\
						<p class="date f-pr">开课时间：{item.currentTerm.startTime|dateConvert} - {item.currentTerm.endTime|dateConvert}</p>\
					</div>\
					<div class="f-icon icon-course-arrow f-fr" style="font-size:20px;" r-class={{"rotate":item.isShow == 1}}></div>\
				</div>\
				<div class="hiddenContent" r-hide="item.isShow == 0">\
					<div class="htit">课程时长：<span class="htxt">{item.currentTerm.duration}周</span></div>\
					<div class="htit">课程负载：<span class="htxt">{item.currentTerm.courseLoad}</span></div>\
					<div class="htit">内容类型：<span class="htxt">{item.currentTerm.courseStyle}</span></div>\
					<div class="htit">课程分类：<span class="htxt">{#list item.categoryNames as categoryName}{categoryName} {/list}</span></div>\
					<div class="des" r-html={item.currentTerm.description}></div>\
					<div class="action">\
						<a class="home f-ib f-mfc f-mfcbd" on-click={this.gotoHome(item.schoolShortName,item.currentTerm.courseId)}>课程主页</a>\
						<div class="video f-ib f-mc f-mcbd" r-hide="item.currentTerm.videoPreview == 0" on-click={this.showDialog(item_index,item.isMaskShow)}>视频试看</div>\
					</div>\
				</div>\
			</div>\
			<div class="mask" r-hide="item.isMaskShow == 0" on-click={item.isMaskShow = 0}>\
				<div class="videoDialog">\
					<div class="line1">\
						<div class="close" on-click={item.isMaskShow = 0}>×</div>\
					</div>\
					<div class="line2">\
						选择要试看的视频\
					</div>\
					<div class="line3">\
						{#list item.currentTerm.videoPreviewContentDtos as videoDto}\
						<div class="videoBtn" on-click={this.playVideo(videoDto.videoId)}>{videoDto.name}</div>\
						{/list}\
					</div>\
				</div>\
			</div>\
			{/list}\
		</div>';

/*继承公共组件，这里和项目相关，Regular并不依赖nej*/
    r._$$SPCoursePanelUI = r._$$BaseComponent.extend({      
        name: 'SPCoursePanelUI',
        template: _template,
        /*数据处理阶段，该阶段DOM还未挂在页面中*/
        config: function(){
     		var lists = this.data.lists;
			for(var i=0,len=lists.length;i<len;i++){
				lists[i].isShow = 0;
				lists[i].isMaskShow = 0;
			}
        },
        /*初始化阶段，该阶段DOM已经存在页面中*/
        init: function(){

	        this.__commonCache = new d._$$COM_Cache_CommonCache();
	        //获取视频信息
	        this.__commonCache._$addEvent("onGetByVideoId",this.__onGetByVideoId._$bind(this));
			/*强制触发脏检测*/
            this.$update();
        },
        /*切换显示状态*/
       	toggleShow: function(index,isShow){
       		isShow = (isShow == 0)?1:0;
       		this.data.lists[index].isShow = isShow;
       	},
        /*打开课程主页*/
        gotoHome: function(name,id){
        	window.open('http://mooc.study.163.com/course/'+name+'-'+id);
        },
        /*打开选择视频弹框*/
        showDialog:function(index,isMaskShow){
        	if(this.data.lists[index].currentTerm.videoPreviewContentDtos.length ==1){
        		this.playVideo(this.data.lists[index].currentTerm.videoPreviewContentDtos[0].videoId);
        	} else {
	        	isMaskShow = (isMaskShow == 0)?1:0;
	        	this.data.lists[index].isMaskShow = isMaskShow;
        	}
        },
        /*客户端视频回调方法*/
       	__onGetByVideoId:function(_data){
       		eu._$callAppPlayVideo(_data.videoVo.mp4HdUrl, '视频介绍');
       	},
        /*播放视频通用方法*/
        playVideo:function(videoId){
            if(eu._$isSupportAppPlayer()){

                this.__commonCache._$getByVideoId(videoId);
            }else{
                eu._$$VideoDialog._$showDialog({     
                    customStyle: 'u-smartVideo',
                    data:{
                        vid:videoId
                    }
                });
            }
        }
    });
	/*一个自定义过滤器，转换时间格式*/
	Regular.filter( "dateConvert" , function(date) {
	    var date = new Date(date);
		var M = date.getMonth()+1 + '月';
	    var	D = date.getDate() + '日';
		var h = date.getHours() + ':';
		var m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
		return M+D+h+m;
	});




    return r._$$SPCoursePanelUI;
};

NEJ.define('{pro}ui/smartSpec/detail/mobile/coursePanelUI.js',[
    '{pro}regularui/base.js'
], f);


```

然后在使用的时候，在需要引入该组件时传入数据,并选中一个节点挂载：

``` javascript
/**
 * 课程详情回调
 */
__proSmartSpecDetail.__onGetYocCourseDtoListBySpecId = function(_data){
	this.__SPCoursePanelUI = new r._$$SPCoursePanelUI({
		data:{
			lists:_data
		}
	});
    this.__SPCoursePanelUI.$inject('#j-coursePanel');
}

```

就可以啦。效果如下：

![iamge](../第一个Regular的UI开发/1.png)

---

# **小结**

日后有时间会详细学习，再整理其细节。