---
title: http状态码的故事
date: 2017-11-01 20:12:53
categories: "web工程"
---

# **前言**
在前端领域开发了一段时间了,其实精彩用到一些技术,却对http各类状态码的使用和原理知之甚少.
之前写过一篇文章整理过[http的一些知识](http://blog.csdn.net/mevicky/article/details/46558225),但是不够细.
故而将日后对http状态码有关的知识进行积累并整理.

# **101**
之前在开发可视化cms时,使用websocket的库socket.io完成了一段从服务端往客户端主动推送信息的逻辑,先看看http内容:

![img](../http状态码的故事/1.png)

现在来说说http101的含义.它的官方解释是**服务器应客户端升级协议的请求进行协议切换** 
需要切换协议时,服务器会发送一个Upgrade响应头来表示其正在切换过去的协议,就比如上图中使用websocke中的Upgrade就是websocket.
具体哪些情况下会使用Upgrade,可以参考[这篇文章](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)


