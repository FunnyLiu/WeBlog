---
title: Node爬虫入门
date: 2016-07-01 15:42:30
categories: "node"
---

# **前言**

今天有空，尝试了一下用node来进行简单的爬取网页数据。特此整理，方便日后需要。

---

# **爬虫**

爬虫可谓博大精深，这里小弟就管中窥豹，简单说下概念和自己的理解。

爬虫其实就是一段**自动抓取互联网信息的程序**。

爬虫的**价值**就是将互联网的数据为我所用。

一个简单的爬虫架构，应该由**调度器、URL管理器、网页下载器、网页解析器**组成。


调度端用来检测和控制爬虫。
URL管理器将制定的url传递给网页下载器。
网页下载后，进入网页解析器。
网页解析器一方面提供有用数据，一方面将找到的有用url加到URL管理器。

![img](../Node爬虫入门/1.png)

爬虫运行流程如下：

![img](../Node爬虫入门/2.png)


---

# **栗子**

我们以nodejs为例子来写一个简单的爬虫。这里选择node不是因为笔者对node很熟悉，而是因为实在对python不熟悉。。。

这里只是爬取静态的页面，需要post或者登陆保护的都没有考虑。

所以说主要是借着这个demo理解爬虫的原理罢了。

以[本网站](http://brizer.github.io/page/2/)为爬取目标。这里以第二页开始，因为第二页开始url才有规律可循。
我们需要先分析每页中文章标题的url的规律。可以发现他们有统一的类名post-title-link

## **首先获取url**

package.json内容如下：
``` javascript
{
  "name": "Spider",
  "version": "1.0.0",
  "description": "spider ",
  "main": "index.js",
  "dependencies": {
    "async": "^1.5.0",
    "cheerio": "^0.19.0",
    "eventproxy": "^0.3.4",
    "superagent": "^1.4.0"
  }
}

```

index.js:

``` javascript
var server = require('./server');

server.start();
```

server.js:

``` javascript
var http = require('http');
var url = require('url');
var async = require('async');
/*http操作库*/
var superagent = require('superagent');
/*node版的jquery*/
var cheerio = require('cheerio');
/*异步库*/
var eventproxy = require('eventproxy');

var ep = new eventproxy();
var urlsArray = [];//存放爬取url
var pageUrls = [];//存放文章页面url
var pageNum = 3;//爬取的文章页数
/*分析需要爬取的网站的分页规律*/
for(var i=2;i<=pageNum;i++){
    pageUrls.push('http://brizer.github.io/page/'+i+'/');
}
/*主程序*/
function start(){
    function onRequest(req,res){
        pageUrls.forEach(function(pageUrl){
            superagent.get(pageUrl)
                .end(function(err,pres){
                    /*获取url*/
                    var $ = cheerio.load(pres.text);
                    var curPageUrls = $('.post-title-link');
                    for(var i=0;i<curPageUrls.length;i++){
                        var articleUrl = curPageUrls.eq(i).attr('href');
                        urlsArray.push(articleUrl);
                        /*相当于计数器*/
                        ep.emit('BlogArticleHtml',articleUrl);
                    }
                });
        });

        ep.after('BlogArticleHtml',pageUrls.length*10,function(articleUrls){
            // 设置字符编码(去掉中文会乱码)
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            /*所有BlogArticleHtml完成后，再触发*/
            res.write('<br/>');
            res.write('文章长度：'+articleUrls.length+'<br/>');
            for(var i=0;i<articleUrls.length;i++){
                res.write('文章url：'+articleUrls[i]+'<br/>');
            }
        });

    }

    http.createServer(onRequest).listen(3000);
}

exports.start = start;

```


其中server.js是关键。我们通过找到分页的规律，每页每页的访问，来获取页面中指定类名的元素，将其url装载到一个变量中。这就是之前原理中提到的**url管理器和网页下载器**。

执行
npm install 
node index.js

访问localhost:3000：

![img](../Node爬虫入门/3.png)


## **深入获取价值数据**

获取到了后续需要访问的url后，我们再对每一个url进行get请求，从而获取其中我们需要的价值数据，原理是一样的：

``` javascript
        ep.after('BlogArticleHtml',pageUrls.length*10,function(articleUrls){
            // 设置字符编码(去掉中文会乱码)
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            /*所有BlogArticleHtml完成后，再触发*/
            res.write('<br/>');
            res.write('文章长度：'+articleUrls.length+'<br/>');
            for(var i=0;i<articleUrls.length;i++){
                res.write('文章url：'+articleUrls[i]+'<br/>');
            }
            /*获取到url后，需要进入相应页面收集需要的数据*/
            res.write('<br/>');
            res.write('开始收集具体数据');
            res.write('<br/>');                        

            /*进入url后的处理函数,我们这里模拟将各个页面的标题取出来*/
            var getContent = function(url){
                superagent.get(url)
                    .end(function(err,ares){  
                        var $ = cheerio.load(ares.text);
                        var curTitles = $('h1');   
                        for(var i=0;i<curTitles.length;i++){
                            var text = curTitles.eq(i).text();
                            /*将获取的有价值的数据存起来*/
                            cacheData.push(text);
                        }
                    });
            }

            var reptileMove = function(articleUrls,callback){
                articleUrls.forEach(function(url){
                    /*拼出真实url*/
                    url = 'http://brizer.github.io'+url;
                    console.log('拼接url：'+url);  
                    /*对真实url进行获取有用信息*/
                    getContent(url);
                });
            };

            reptileMove(articleUrls,function(){
                res.write('<br/>');
                res.write('执行完毕！');
                res.write('<br/>');      
                //回调函数
                console.log('全部执行完毕');
                /*将所有标题展示出来*/
                res.write('标题个数：'+cacheData.length+'<br/>');
                for(var i=0;i<cacheData.length;i++){
                    res.write('标题'+(i+1)+'：'+cacheData[i]+'<br/>');    
                }
            });  

        });

```


最后即可成功获取所有数据。然后进行对应操作。

这里有些网站会采取防爬措施，比如github就会防止我们爬取它的内容，所以上面的代码其实是不能获取到每个页面具体内容的。
但是爬虫的基本原理就是这样的。
接下的的就是攻与防的故事了.....

最后放上server.js完成代码：
``` javascript
var http = require('http');
var url = require('url');
/*异步库*/
var async = require('async');
/*http操作库*/
var superagent = require('superagent');
/*node版的jquery*/
var cheerio = require('cheerio');
/*异步库*/
var eventproxy = require('eventproxy');

var ep = new eventproxy();
var urlsArray = [];//存放爬取url
var pageUrls = [];//存放文章页面url
var pageNum = 6;//爬取的文章页数
var cacheData = [];//存放最终需要爬取的数据
/*分析需要爬取的网站的分页规律*/
for(var i=3;i<=pageNum;i++){
    pageUrls.push('http://brizer.github.io/page/'+i+'/');
}
/*主程序*/
function start(){
    function onRequest(req,res){
        pageUrls.forEach(function(pageUrl){
            superagent.get(pageUrl)
                .end(function(err,pres){
                	/*获取url*/
                	var $ = cheerio.load(pres.text);
                	var curPageUrls = $('.post-title-link');
                	for(var i=0;i<curPageUrls.length;i++){
                		var articleUrl = curPageUrls.eq(i).attr('href');
                		urlsArray.push(articleUrl);
                		/*相当于计数器*/
                		ep.emit('BlogArticleHtml',articleUrl);
                	}
                });
        });

        ep.after('BlogArticleHtml',pageUrls.length*10,function(articleUrls){
        	// 设置字符编码(去掉中文会乱码)
			res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        	/*所有BlogArticleHtml完成后，再触发*/
        	res.write('<br/>');
        	res.write('文章长度：'+articleUrls.length+'<br/>');
        	for(var i=0;i<articleUrls.length;i++){
        		res.write('文章url：'+articleUrls[i]+'<br/>');
        	}
        	/*获取到url后，需要进入相应页面收集需要的数据*/
        	res.write('<br/>');
        	res.write('开始收集具体数据');
        	res.write('<br/>');        	        	

        	/*进入url后的处理函数,我们这里模拟将各个页面的标题取出来*/
        	var getContent = function(url){
        		superagent.get(url)
        			.end(function(err,ares){  
	                	var $ = cheerio.load(ares.text);
	                	var curTitles = $('h1');   
		        		for(var i=0;i<curTitles.length;i++){
		        			var text = curTitles.eq(i).text();
		        			/*将获取的有价值的数据存起来*/
		        			cacheData.push(text);
		        		}
        			});
        	}
  
        	var reptileMove = function(articleUrls,callback){
        		articleUrls.forEach(function(url){
	        		/*拼出真实url*/
	        		url = 'http://brizer.github.io'+url;
	        		console.log('拼接url：'+url);  
	        		/*对真实url进行获取有用信息*/
	        	    getContent(url);
        		});
        	};

        	reptileMove(articleUrls,function(){
	        	res.write('<br/>');
	        	res.write('执行完毕！');
	        	res.write('<br/>');      
        		//回调函数
        		console.log('全部执行完毕');
        		/*将所有标题展示出来*/
        		res.write('标题个数：'+cacheData.length+'<br/>');
	        	for(var i=0;i<cacheData.length;i++){
	        		res.write('标题'+(i+1)+'：'+cacheData[i]+'<br/>');    
	        	}
        	});  

        });

    }

    http.createServer(onRequest).listen(3000);
}

exports.start = start;

```

---

# **参考**

[前端爬虫系列](http://www.tuicool.com/articles/MvUjMfB)