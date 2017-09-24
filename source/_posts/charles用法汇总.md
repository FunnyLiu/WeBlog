---
title: charles用法汇总
date: 2017-09-24 15:52:20
categories: "web工程"
---


# 前言
charles是常用的抓包工具，这里整理一下自己在使用过程中的一些经验。
首先说明，我使用的是mac端的3.11.2版本的charles。

# 抓取Https
如果不设置，默认抓取https的页面，返回值是乱码的。
1.首先下载证书
Help    SSL Proxying      Install Charles Root Certificate
![这里写图片描述](http://img.blog.csdn.net/20170903125921152?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

2.信任改证书
证书下载后，会出现在系统的钥匙串访问中，需要选中对应的证书，点击左下角的信息按钮，将其标为始终信任。
![这里写图片描述](http://img.blog.csdn.net/20170903130311470?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
3.设置url开启SSL
如果想抓取某个网站的HTTPS信息，比如知乎，需手动开启该网站的Enable SSL Proxying
![这里写图片描述](http://img.blog.csdn.net/20170903130333482?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

4.成功获取信息
这样就可以成功抓取该url的https信息了，不再是乱码了。
![这里写图片描述](http://img.blog.csdn.net/20170903130345556?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

# 移动端抓取Https
移动端在练到代理后，
1 下载证书
![这里写图片描述](http://img.blog.csdn.net/20170903130507536?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

2 访问对应url是，enable即可。

是不是很简单。

# 并发请求
模拟DDOS，相当给力
![这里写图片描述](http://img.blog.csdn.net/20170903130555332?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

进入Repeat Advanced后，可以选择访问次数和并发数。
![这里写图片描述](http://img.blog.csdn.net/20170903130607880?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

然后开始疯狂的DDOS吧！

# 修改请求
修改请求内容，比如post数据等等，也很简单，对应的接口edit
![这里写图片描述](http://img.blog.csdn.net/20170903130649951?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

修改完毕后执行即可。

# 接口重定向
将接口的返回值变成自己想要的值。
## 1 Map Local
![这里写图片描述](http://img.blog.csdn.net/20170903130820233?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
## 2 将接口重定向到本地文件
![这里写图片描述](http://img.blog.csdn.net/20170903130832367?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 3 mac本地txt
最适合的方式，只有vi编辑器了。
通过vi命令创建或进入文本，再修改，完毕后esc    :wq 保存并退出即可。

这种方式很愚蠢，直接使用sublime可能会更加方便一些。

## 4 管理Map

不想重定向时，在Tools中的Map Local关闭即可。
![这里写图片描述](http://img.blog.csdn.net/20170903130857124?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


## 5 批量map【好像无效，需要再试试】
有时候需要批量一个文件夹下所有文件替换。
比如nej打包后的线上，和本地打包的文件修改。这时用正则就好了。
![这里写图片描述](http://img.blog.csdn.net/20170903130912834?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

# 模拟网速
有时候需要模拟网速，虽然说chrome有这个功能，但是移动端真机调试的时候，charles还是占据了主导地位。
打开方式：
![这里写图片描述](http://img.blog.csdn.net/20170903131031359?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
调整为3g或4g
![这里写图片描述](http://img.blog.csdn.net/20170903131042708?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

之后通过菜单栏的小旗快捷键即可：
![这里写图片描述](http://img.blog.csdn.net/20170903131052748?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
 
# 重定向json格式
如果未rewrite，直接将一个json格式的数据通过maplocal本地重定向，会报错。需要重写：
tool    rewrite 
![这里写图片描述](http://img.blog.csdn.net/20170903131156819?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

# 修改中文乱码
如下图，某请求：
![这里写图片描述](http://img.blog.csdn.net/20170903131310266?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
设置
![这里写图片描述](http://img.blog.csdn.net/20170903131329279?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

# rewrite响应内容
rewrite功能非常强大，可以重写某些url的body或head等内容。
比如我们要修改响应body中服务器返回的时间来进行本地化的测试：
![这里写图片描述](http://img.blog.csdn.net/20170903131518220?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvbWV2aWNreQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
