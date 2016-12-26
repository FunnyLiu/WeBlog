---
title: Angular中通过ajax上传文件解决方案-项目经验
date: 2016-04-28 15:58:28
categories: "angular"
---

# **前言**

使用场景，不使用任何插件，通过input type=file获取文件，通过ajax进行上传到服务器接口。这里单独提出该方案，是因为填了两个坑，一个是ajax中不能上传文件的坑，一个是angular中通过ng-model无法获取type=file的input的值的坑。

---

# **获取文件的值**

我们自行定义一个指令，来实现type=file的input可以获取到值。
首先我们看看html代码：
``` html
<form name="sendMessage" ng-submit="submitForm()" novalidate>
	<div class="form-group f-cb">
		<div class="row">
			<div class="col-md-2 text-center">
				<label for="">选择模板</label>
			</div>
			<div class="col-md-3">
				<select class="form-control col-xs-3" ng-model="firstTemplate" ng-options="template.id as template.name for template in templates"></select>
			</div>    		
		</div>
		<div class="b-20"></div>			
		<div class="row">
			<div class="col-md-2 text-center">
				<label for="">选择接收人</label>
			</div>
			<div class="col-md-3">
				<input type="file" name="fileUpload" id="fileUpload" value="" custom-on-change="uploadFile"/> 
			</div>
			<div class="col-md-6">上传带有用户号码的txt文件，号码一行一个，查看<a target="_blank" style="padding-top: 8px;" ng-href="{{demoLink}}">示例文件</a></div>
		</div>		
		<div class="b-20"></div>
		<div class="row">
			<div class="col-md-2 text-center">
				<label for="">短信内容</label>
			</div>
			<div class="col-md-6">
				<textarea name="" rows="10" cols="10" ng-model="content" class="form-control text-center" style="text-align: left;" required></textarea>
				*建议不超过150字
			</div>
		</div>
		<div class="b-20"></div>
		<div class="row">
			<div class="col-md-4 col-md-offset-2">
				<button type="submit" class="btn btn-success">发送</button>
			</div>
		</div>
	</div>
</form>	
```

重点在于自定义指令，来获取选中的上传文件。

``` html
	<input type="file" name="fileUpload" id="fileUpload" value="" custom-on-change="uploadFile"/> 
```

我们接下来看看自定义指令：
``` javascript
/*自定义指令*/
g.adminApp.directive('customOnChange',function(){
	return {
		restrict:'A',
		link:function(scope,element,attrs){
			var onChangeHandler = scope.$eval(attrs.customOnChange);
			element.bind('change',onChangeHandler);
		}
	};
});
```
这样就可以在作用域中通过custom-on-change指定的方法(这里是uploadFile)，来获取到文件对象：

``` javascript
/*选择文件*/
$scope.uploadFile = function(event){
	var file = event.target.files[0];
	$scope.file = file;
};  
```
# **上传文件的值**

获取到文件对象后，我们需要通过表单的提交来执行submit方法：

``` javascript
/*选择文件*/
$scope.uploadFile = function(event){
	var file = event.target.files[0];
	$scope.file = file;
};  

/*发送信息*/
$scope.submitForm = function(){
	if(!$scope.file){
		alert('请上传接收人名单');
		return false;
	}
	if($scope.content.length>150){
		alert('短信内容请不要超出字数');
		return false;
	}	
	/*post提交数据,涉及到文件*/
	$http({
		method:'POST',
		url:'/backend/sms/postShortMessage.htm',
		headers:{
			'Content-Type':'multipart/form-data'
		},
		data:{
			'template':$scope.firstTemplate,
			'content':$scope.content,
			'receiversFile':$scope.file
		},
		transformRequest: function(data,headersGetter) {//进行格式转换，非常关键
			var formData = new FormData();//将model转为表单格式
			angular.forEach(data,function(value,key){
				formData.append(key,value);
			});
			var headers = headersGetter();
			delete headers['Content-Type'];
			return formData;
		},
	}).success(function(data){
		alert(data.msg);
	}).error(function(data){
		alert(data.msg);
	});
};
```

其中**transformRequest**是关键的一步，对于文件对象来时候，格式转换相当关键。

---

# **感悟**

第一次知道ajax无法直接post文件，显然自己还是比较无知，经验也不够丰富。一起加油一起成长吧。





