---
title: npm入门文档解读
date: 2018-04-26 13:55:22
categories: "node"
---

# 前言
最近抽空阅读了下npm官方文档的一些内容，特此整理，方便大家共同学习。如有问题，还希望高手指正。

# npm是什么
npm就是一个node的包管理器。npm官方的介绍其由3个部分组成。

- 网站

- 注册表

- 命令行工具（CLI）


[网站](https://www.npmjs.com/)是用来寻找需要的npm包的位置；

注册表是一个巨大的数据库，用来保存每个package的信息；

CLI是开发者用来发布package或下载使用package的工具。

# npm和其他包管理器的区别
既然npm是包管理器，那为什么要用它，或者说什么场景下使用它比较合适呢？这就需要了解几种常见包管理器的区别。这里就以我们用到的npm和bower来比较。

## bower
bower是前端模块管理，由twitter推出，它对包的结构没有强制性的要求，因为它本身并不提供一套完整的构建工具，只是一个资源的共享平台。

bower本身也不会去存储模块文件，而是通过git的方式，可以通过根目录下的.bowerrc文件来指定git源以及下载保存的路径等参数。以edu-special-marketing工程为例：
```
{
  "directory": "./lib/",
  "registry": "http://59.111.98.233:5678/",
  "timeout": 300000
}
```

最重要的一点就是，bower处理依赖的方式的扁平化的，也就是说，相同模块不会有不同的版本共存，这也就是为什么我们每次bower update，如果依赖的组件版本有冲突，需要手动解决了。

## npm
npm是基于node模块的管理器，他原生支持commonJS的规范，有一套完整的构建机制。

npm会去存储每一个模块的信息到注册表中，也可以通过.npmrc文件指定路径和源：
```
sass_binary_site = https://npm.taobao.org/mirrors/node-sass/
registry = http://rnpm.hz.netease.com/
cache = ./.cache/.npm
```

虽然npm是基于node的模块管理，但是npm也可以作为前端模块管理工具，配合上Browerify，可以在npm上发布和引用前端的静态资源。Browerify本身不是模块管理器，只是让服务端的commonJS格式的模块可以运行在浏览器端。

最重要的一点，他处理依赖的方式是树状的，也就是说，相同的模块在不同的依赖中可能存在不同的版本而又互相不影响，这个一般在前端方面是不建议的。 当然也不是不行，通过[npm dedupe](https://docs.npmjs.com/cli/dedupe)还是可以让node_modules扁平化的。

# npm的安装
npm基于node，所以需要自行安装node。由于node在使用过程中，经常遇到需要切换node版本的场景。所以推荐使用一些node版本工具，比如说nvm来安装node。或者是在node安装后，通过n模块来切换node的版本。

这里奉上[nvm安装流程](https://github.com/creationix/nvm/blob/master/README.md#installation),windows用户看[这里](https://github.com/coreybutler/nvm-windows)

**更新npm到最新**
```
npm install npm@latest -g
```

# package.json
提到npm，就不得不说下package.json文件了。
使用package.json来管理项目的依赖是最为合理的，优点如下：

1. 列出项目依赖的包列表；
2. 使用语义版本规则来指定项目依赖的包版本；
3. 配置可以复用

## 初始化
可以通过npm init交互式的方式，也可以通过npm init --yes的方式初始：

![img](http://edu-image.nosdn.127.net/77f97bc4-10b9-4962-824a-4abc97fbc9fc.png?imageView&quality=100)

这里主要说一下语义化的版本规范

## 语义化的版本
如果一个项目将与其他人共享，它应该从1.0.0开始。
然后基本规则如下：

![img](http://edu-image.nosdn.127.net/0b4a9e10-fc32-4991-99d5-4de4f2923aeb.png?imageView&quality=100)

[具体的规则](https://semver.org/lang/zh-CN/)。
使用者在package.json中依赖时，根据不同写法，使用不同版本：

如果用1.0.4版本：

- Patch releases: 1.0.x or ~1.0.4      不会超过   1.1

- Minor releases: 1.x or ^1.0.4             不会超过  2

- Major releases: * 保持最新

但是这里的^要额外注意一点，就是它是以第一位不为0的版本位来约束的，举个例子：
```
^1.2.3 := >=1.2.3 <2.0.0
^0.2.3 := >=0.2.3 <0.3.0
^0.0.3 := >=0.0.3 <0.0.4
```






这里有一篇好文，[详细介绍了package.json中的每个参数](https://www.cnblogs.com/tzyy/p/5193811.html)





# 基本操作

## 安装包

```
npm install ***
```

通过不同参数指定不同package.json中存储的位置。

在npm5之前，npm install后，npm只会下载依赖到当前目录的node_modules，并不会在package.json中写入依赖信息。npm5之后，默认是写到dependencies中。

还可以带其他参数：

```
npm install jquery --save-dev
npm install lodash --save-optional
```
package.json为：
```
  "devDependencies": {
    "jquery": "^3.3.1"
  },
  "optionalDependencies": {
    "lodash": "^4.17.4"
  }
```

各个依赖的区别：
- dependencie 生产环境下使用的依赖
- devDependencies 开发环境下使用的依赖
- optionalDependencies 可选的依赖

devDependencies中的依赖，在发布时是不会带到npm上的。也就是说使用该模块的人，在node_modules中对应模块是找不到的。
如果optionalDependencies中的模块安装失败，是不会导致npm install失败的。

## 全局与本地的选择
全局安装只需要加上参数 -g即可
```
npm install nei -g
```

那么何时全局安装呢？这里直接引用官网的原文：

If you want to use a package as a command line tool, then install it globally. This way, it works no matter which directory is current. This is the choice you would use if you were installing grunt, for example.

If you want to depend on the package from your own module, then install it locally. This is the choice you would use if you are using require statements, for example.

大概就是说：

如果是想当做一个命令行工具来使用，就安装为全局，这样不管在哪个文件路径都能使用；

如果是本项目依赖的模块，比如说node的require，就用本地安装。

但是这里也不应该一味的按照这种方式，比如说[webpack](https://webpack.js.org/plugins/npm-install-webpack-plugin/#install)，就鼓励大家将命令行工具加到devDependencies中。而且配合npx来使用，本地安装也行，这个后面会说到。

## 更新包

可以通过
```
npm outdated
```
查看哪些包需要更新

![img](http://edu-image.nosdn.127.net/63ae77b3-eeb3-4114-bc80-f0ea40be9665.png?imageView&quality=100)

查看全局需要更新的包
```
npm -g outdated
```
![img](http://edu-image.nosdn.127.net/09c20bd8-812e-4d64-97ee-23c595234d79.png?imageView&quality=100)

这里的wanted就是符合当前语义化版本规范的版本，而latest就是最新版本。举个例子：

![img](http://edu-image.nosdn.127.net/df853136-3a49-47d9-801a-c7d2e810def4.png?imageView&quality=100)

**更新操作**

```
npm update
```
即可


## 卸载包

```
npm uninstall ***
```

注意如果只是单纯执行该命令，package.json中的配置是不会取消的，所以还需要带上对应的参数，比如

```
npm uninstall *** --save-dev
```
才会同步修改package.json


**全局卸载**

```
npm uninstall -g *** 
```



# package

## 创建
通过前面介绍的init命令创建package.json，并创建一个入口文件index.js。里面增加一个函数，暴露给其他模块调用，一个最简单的模块就完成了。

```
exports.sayHello = function(){
	console.log('i am fang');
}
```
## 发布


### 判断登录
如果要发布一个包，首先必须是npm注册表上的用户。
如果不是用户，先通过`npm adduser` 创建于用户。如果在网站上创建了用户，通过
`npm login`
与客户端绑定关系。

首先通过`npm whoami`查看是否登录:
![img](http://edu-image.nosdn.127.net/9a4f31ab-8811-4b87-8237-2dc84e75effd.png?imageView&quality=100)

通过`npm adduser`增加用户：
![img](http://edu-image.nosdn.127.net/483f316b-6eab-48bc-8cbf-efef34ab63af.png?imageView&quality=100)

### 发布包

开始发布包
首先取个名字，满足以下条件：
* 独特的名字，不重复；
* 不要拼错，尽量语义化；
* 不要混淆其他作者的名字

使用npm publish来发布一个包，除了.gitignore和.npmignore中的文件忽略以外，其他的内容都会被包含，然后就交给npm审核了。

例如，package.json文件如下：
![img](http://edu-image.nosdn.127.net/b645883f-9f5e-4d68-b4b4-737cc5573cf4.png?imageView&quality=100)

通过`npm publish`发布包：

![img](http://edu-image.nosdn.127.net/46cb04e6-a830-4e52-8eea-e1fa23e18a0a.png?imageView&quality=100)

审核通过后，就可以直接访问[我的包](https://www.npmjs.com/package/lftestpackage)了。


### 更新包

发布包后，需要更新的话，通过`npm version`修改版本，然后再通过`npm publish`发布包。

例如我们给lftestpackage增加readme后，打版本并提交：

![img](http://edu-image.nosdn.127.net/dfc8b688-dbf6-476f-8e29-dd89aa748b9a.png?imageView&quality=100)






# npx
[npx](https://www.npmjs.com/package/npx)是一个npm的包执行器，npm5.2版本以上会自动安装。


## 安装npx
![img](http://edu-image.nosdn.127.net/7b65d822-e37a-4564-b4ae-3f4c3c291c99.png?imageView&quality=100)

## 使用场景

### 直接使用某些包的命令
npx有很多作用，这里展示一个用npx直接调用命令的例子。

![img](http://edu-image.nosdn.127.net/795e635f-9477-458d-a84b-1a805dc18ed0.png?imageView&quality=100)

有兴趣的同学可以测试一下，[一个完整的npx入门项目](https://github.com/js-n/awesome-npx)


### 切换node版本

可以通过不同版本的node来执行命令。
一个简单的例子：

![img](http://edu-image.nosdn.127.net/f45dd3f6-5ac2-4332-92db-27dab6e04000.png?imageView&quality=100)

一个实际的应用场景，比如说我们的edu-special-marketing工程的build命令，在node8环境下会失败：

![img](http://edu-image.nosdn.127.net/4e23ffa5-eb37-44e3-bffb-18af57b599ee.png?imageView&quality=100)

可以通过npx用不同版本的node来执行：

![img](http://edu-image.nosdn.127.net/1d3e01a6-d65f-4123-ab82-1abda5765b7d.png?imageView&quality=100)

即可成功得到结果。

### 使用本地包替代全局命令包

又或者看看我们云课堂工程的构建脚本：

![img](http://edu-image.nosdn.127.net/ab00bcfc-c004-4ce8-b2c1-6bdafc171060.png?imageView&quality=100)

通过启用npx，就可以避免构建机同时安装各种命令所需的执行环境，这样在迁移和维护的时候，都会方便很多。


# scoped package
scoped将相关的包组合在一起，相对于一个命名空间。如果一个包以@开头，那么就是一个scoped package。
每个用户都有自己的scope，比如：
```
@username/project-name
```

## 初始化
要创建一个scoped package，只需使用一个以scope开始的包名。
```
{
  "name": "@brizer/lfscopedpackage"
}
```
如果您使用npm init，则可以将范围作为选项添加到该命令。
```
npm init --scope=brizer
```
如果始终使用相同的范围，可以在.npmrc文件中配置
```
npm config set scope brizer
```

例如：

![img](http://edu-image.nosdn.127.net/85d3e451-9656-4da4-9aaa-6c8c15c32977.png?imageView&quality=100)

## 发布
发布scoped package分为公有和私有的。
公有`npm publish --access=public`,私有`npm publish --access restricted`。这里注意如果是发布私有的，需要在npm官网上申请，然后可以在官网上控制权限。

这里以公有包发布为例：

![img](http://edu-image.nosdn.127.net/bca41eef-e966-40af-b9ec-162f7554295c.png?imageView&quality=100)

发布后可以[查看](https://www.npmjs.com/package/@brizer/lfscopedpackage)


## 使用
那么如何使用scoped package呢？
以下三种场景
```
{
  "dependencies": {
    "@username/project-name": "^1.0.0"
  }
}

npm install @username/project-name --save

var projectName = require("@username/project-name")
```

其实scoped package，我们也使用过。老的版本的组件库和util，都是封装在[自己npm平台的](http://npm.hz.netease.com/browse/keyword/study)。


![img](http://edu-image.nosdn.127.net/20f10bfb-a636-44b7-a054-0859665512d5.png?imageView&quality=100)

所以scoped也是管理组件池的一种方案。

# dist-tags
前面提到过[语义化版本](https://semver.org/lang/zh-CN/)，dist-tags是它的补充。

## 查看基本信息
首先通过`npm info`查看基本信息：

![img](http://edu-image.nosdn.127.net/bdca24d6-b06c-4b13-9112-ae9e55719bc0.png?imageView&quality=100)

可以看到，默认npm会为我们的包带上latest的tag。npm publish和 npm install默认都会给我们使用latest的tag。模块的维护者在进行模块发布时，可以指定将当前版本发布为哪个 tag。


## 查看

```
npm dist-tag ls [<pkg>]
```

![img](http://edu-image.nosdn.127.net/3865954b-b4a4-4cda-8189-af6bcfef647d.png?imageView&quality=100)

## 发布和使用
例如我们在一个包中修改了内容，然后通过beta版本发布：

![img](http://edu-image.nosdn.127.net/0615d576-a651-4d83-b345-53f688511255.png?imageView&quality=100)

另一个工程就如果直接安装改模块，是不会安装到beta版本的:

![img](http://edu-image.nosdn.127.net/3e3e5cc9-48b7-42aa-b829-cf809ad5c5ae.png?imageView&quality=100)

只有指定了beta版本的安装才有效：

![img](http://edu-image.nosdn.127.net/b340fa83-8be9-4422-b50c-c186adf6fb31.png?imageView&quality=100)

之后的一切安装都是基于该tag，除非手动切换到latest版本。

## 使用场景

发布测试包又不想影响正式包的时候可以使用这种方式。

或者说某些新，但是不稳定的版本，也可以通过这种方式，让社区先使用。例如[webpack](http://registry.npmjs.com/webpack)

![img](http://edu-image.nosdn.127.net/820ace09-b666-45e0-9c19-87558226c2b8.png?imageView&quality=100)


# package-lock.json
先说下package-lock.json文件是做什么的。
1. 对依赖树的具体描述和记载，保存统一模块的依赖唯一；
2. 方便用户回溯到之前的node_modules，而不用提交目录本身。
3. 优化安装过程，提高安装效率（安装过程中，npm会去跳过之前的重复模块）

package.json文件里面，定义的是版本的范围，具体跑`npm install`的时候安装什么版本，要解析后才能决定。这里的定义称为逻辑树。

而node_modules文件夹下才是npm实际安装的确定版本的东西，这里的文件结构我们称之为物理树。

安装的过程中，逻辑树和物理树实际上会有一些差别，比如说去重。

package-lock.json文件可以理解为结合了逻辑树和物理树的一个快照，里面有明确的各依赖版本号，实际安装的结构，也有逻辑树的结构。

## 一个例子
这里可以看一个小例子，来明白lock的作用哈。

我们有两个包，一个是lftestpackage,一个是lfscopedpackage。

lftestpackage依赖lodash 4.17.5，而lfscopedpackage依赖lftestpackage

那么lfscopedpackage执行npm install后的package-lock文件如下:

![img](http://edu-image.nosdn.127.net/8145986c-3225-4d11-95eb-d3d8aaaae464.png?imageView&quality=100)

对应的node_modules文件结构如下：

![img](http://edu-image.nosdn.127.net/0efa8a32-445e-4e51-a905-9b723c0722e2.png?imageView&quality=100)

现在修改了lfscopedpackage的依赖，增加一个不同版本的lodash,然后执行npm install后的package-lock文件如下:

![img](http://edu-image.nosdn.127.net/3499ebf1-df17-4e65-81a4-68bf7e787941.png?imageView&quality=100)

对应的node_modules文件结构如下：

![img](http://edu-image.nosdn.127.net/66aba990-fc14-40ec-bffe-c43e5ba0d255.png?imageView&quality=100)

npm会根据package-lock文件，有自己的一套算法，提高下载速度。

## 如何启用
npm高于5的版本是默认启动的，但是可以手动取消。

如果你使用 lock 机制，则应该将 package-lock.json 提交到 repo 中。比如 Vue 采取了该策略。

如果你不使用 lock 机制，则应该加入 .npmrc 文件，内容为 package-lock=false ，并提交到 repo 中。比如 ESLint 采取了该策略。

例外是，如果你使用 yarn 并且不打算使用 npm，则可以把 package-lock.json 列入 .gitignore（比如 Babel）；反之如果你使用 npm 并且不打算使用 yarn，则可以把 yarn.lock 列入 .gitignore （比如 TypeScript）。

有一些不使用 lock 机制的库，已经使用了 .npmrc ，但也把 package-lock.json 列入了 .gitignore，这是没有必要的。

# 小结
以上内容都是一些关于npm的基础和入门知识，还有更多较为深入的知识或者细节，有待进一步研究。

