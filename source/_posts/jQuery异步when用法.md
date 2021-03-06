---
title: jQuery异步when用法-项目经验
date: 2016-03-16 08:32:43
categories: "jquery"
---
# jQuery异步编程之when用法

---

## **前言**

我们有时候会有一些需求就是某些异步操作比如ajax完成后再执行某些操作。一般我们可以通过ajax方法的done方法来回调。但是如果是多个ajax呢？

---

以一个实例来说明：

``` javascript			
$.when($.ajax({
	url:"http://study.163.com/cps/personal/info.htm",   
	method:"GET",
	data:''
}),$.ajax({
	url:"http://study.163.com/cps/personal/courseCard.htm",
	method:"GET",
	data:{"productType":30,"ids":$list_1.data("ids")}   
}),$.ajax({
	url:"http://study.163.com/cps/personal/courseCard.htm",
	method:"GET",
	data:{"productType":0,"ids":$list_2.data("ids")}
}))
	.done(function(d1,d2,d3){
		personInfo = JSON.parse(d1[0]);
		initData();
		cardsInfo = JSON.parse(d2[0]);     
		initYoocCards(cardsInfo);
		studyCardsInfo = JSON.parse(d3[0]);
		initStudyCards(studyCardsInfo);	    			
		initEvents()
	}); 
```

可以看到，我们通过在when中注册多个ajax，然后done后再执行后续操作。
其中的d1,d2,d3分别是3个ajax的返回结果。我们去d1[0]的原因是它才是最后的数据集合，d1[1]则是success的状态值。


---

再来看看我从一篇文章中发现的例子，个人觉得比较典型：

``` javascript
var username = 'testuser';
var fileToSearch = 'README.md';

$.getJSON('https://api.github.com/user/' + username + '/repositories')
  .then(function(repositories) {
    return repositories[0].name;
  })
  .then(function(lastUpdatedRepository) {
    return $.getJSON('https://api.github.com/user/' + username + '/repository/' + lastUpdatedRepository + '/files');
  })
  .then(function(files) {
    var README = null;

    for (var i = 0; i < files.length; i++) {
      if (files[i].name.indexOf(fileToSearch) >= 0) {
        README = files[i].path;

        break;
      }
    }

    return README;
  })
  .then(function(README) {
    return $.getJSON('https://api.github.com/user/' + username + '/repository/' + lastUpdatedRepository + '/file/' + README + '/content');
  })
  .then(function(content) {
    console.log(content);
  });
```



