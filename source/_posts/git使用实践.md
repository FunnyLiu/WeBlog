---
title: git使用实践
date: 2016-06-07 15:57:52
categories: "web工程"
---

# **前言**
git在开发中是必不可少的，可以使用一些工具比如小乌龟或者sourcetree等。也可以使用gitBash来手敲命令。这里主要整理一些具体情况下应该如何操作git命令。

---
# **头图威武**

先上图：

![images](/git使用实践/1.png);

上图中的git命令基本覆盖了所有应用场景。

git的运行机制不再重复：

![images](/git使用实践/2.png);

![images](/git使用实践/3.png);


---

# **使用场景**

针对不同使用场景，使用不同的命令。

## **拉取远程仓库内容**

使用`git clone`来拉取对应git仓库.比如:
```
git clone https://github.com/jquery/jquery.git
```

## **创建版本库**

使用`git init`命令将这个目录变成git可以管理的仓库

![images](/git使用实践/4.png);

## **提交文件**

将文件放到仓库需要两步。
1、`git add`命令，将文件加入暂存区。
2、`git commit`命令，把文件提交到提交区。

![images](/git使用实践/5.png);

```shell

# 提交暂存区到仓库区
$ git commit -m [message]

# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a

# 提交时显示所有diff信息
$ git commit -v

# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]

# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

## **删除文件**
```

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]
```

## **查看帮助**

git help.

例如，要想获得 config 命令的手册，执行

```
git help config
```

就可以打开手册

## **查看配置信息**
使用`git config -l`查看详细配置信息

使用`git config --local -l`查看该仓库配置信息

使用`git config --global -l`查看全局配置信息

## **编辑配置信息**

```
git config --global user.name "Your Name" 
git config --global user.email "email@example.com"
```


## **查看状态**

使用`git status`查看状态：

![images](/git使用实践/6.png);

## **查看文件变化**

使用`git diff`查看具体修改了哪些内容。

![images](/git使用实践/7.png);

该命令可以设置参数：

![images](/git使用实践/8.png);

## **已add未commit查看文件变化**


git diff -cached


`git diff –cached`比较常用，比较暂存区和上一次提交之间的差异。也就是说，**add之后，可以通过git diff –cache来查看变化。**


## **已commit查看文件变化**

git log -p即可  


## **查看日志**

通过`git log`来查看提交日志：

![images](/git使用实践/9.png);


## **查看文件详细修改记录**

使用 `git log -p filename` 就可以看到**这个文件所有的历史修改记录**。这样在我们pull代码下来之后想查看某个文件，或者修改了某个文件但是想找到以前版本的代码非常有用。

这里需要注意，filename是需要带路径的，所以我们最好可以在需要对比的文件所在目录git bash来输入命令。比较方便。

```shell
# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat

# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]

# 显示指定文件相关的每一次diff
$ git log -p [file]

# 显示指定文件是什么人在什么时间修改过!!!可以具体到某一行
$ git blame [file]

# 显示暂存区和工作区的差异
$ git diff

# 显示暂存区和上一个commit的差异
$ git diff --cached [file]

# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD

# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]

# 显示某次提交的元数据和内容变化
$ git show [commit]

# 显示某次提交发生变化的文件
$ git show --name-only [commit]

# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]

# 显示当前分支的最近几次提交
$ git reflog
```

## **各种撤销**
```shell
# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到工作区
$ git checkout [commit] [file]

# 恢复上一个commit的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]

```

## **未add之前取消修改**

未add之前，如果发现修改完全没有必要，通过`git checkout`来撤销。

一般 `git checkout .` 来**撤销所有修改**。

![images](/git使用实践/10.png);

## **已add，未commit之前取消修改**

```
git reset HEAD <file>...
```

![images](/git使用实践/21.png)

## **已commit，未push之前取消修改**

本地修改代码之后，并且commit了，也不想要。
`git revert HEAD`

**需要注意！**，从add到commit的代码会都不复存在了。

![images](/git使用实践/21.png)


## **已commit,未push之前修改提交描述**

如果已经commit,但是发现描述错误。可以使用:

```
git commit --amend
```
重新进入描述编辑。

![images](/git使用实践/20.png)

该命名还可以补充add时用。

``` 
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```

最终你只会有一个提交 - 第二次提交将代替第一次提交的结果。

## **版本回退**

如果已经push上去了，那就干脆版本回退吧。
在Git中，HEAD表示当前版本，上一版本就是HEAD^，上上一版本就是HEAD^^，也可以用HEAD~2来表示上上一版本。

我们通过git reset命令来回溯版本：

![images](/git使用实践/12.png);

如果我们后悔了，不想回到这个版本了，怎么办呢？
我们只要得到commit id，就可以通过id来返回：

![images](/git使用实践/13.png);

这里版本号不用写全。

如果我们找不到commit id怎么办，我们可以通过`git reflog`命令查看我们所有使用过的命令：

![images](/git使用实践/14.png);

这样就可以找到对应的commit id了。

最后将这个版本重新push既可以完成 push后的版本回退了。当然，还有一种方法：
git revert <需要撤消的Hash值> 这个hash值可以使用git log 来查看、复制、粘贴



## **任意版本切换**

有时候我们回退后，又想回到最新的版本，或者某一版本。
可以通过`git reflog` 列出近期修改，找到要的 hash 然后 reset。


## **创建,切换分支**

`git branch dev` 是创建dev分支。
`git checkout dev` 是切换到dev分支。
然后我们可以通过`git branch`命令查看分支状态：

![images](/git使用实践/15.png);

带星号的就是我们现在所在的分支。

如果需要查看远程分支，则需要带上参数a：
```
git branch -a
```

如果看到红色的分支中有自己想要的，说明它不在本地，但是已经可以切换过去了，不过需要注意切换的方式：

```
git checkout –track
```
 

当然最好是回到master先pull，再checkout来切分支。

## **合并分支**

```
git merge dev
```

![images](/git使用实践/16.png);

## **删除分支**

```
git branch –d dev
```

![images](/git使用实践/17.png);


## **撤销合并分支**
如果merge后发现很多冲突,不想解决,放弃本地分支.可以考虑如下步骤:

```
git reset --hard HEAD //回溯版本
git clean -xdf //删除当前目录下没有追踪的文件
git checkout hotfix/home_page_fix_lf_20170310 //切回到之前的分支
git branch -D feature/audio-lesson-jt-20170307 //将有冲突的那个本地分支删除(保险)
```


## **推动本地分支到远程**

本地创建的分支需要和其他人一起进行开发，则需要将其推动到远程：		
`git push`，添加分支路径名来推动指定分支。

![images](/git使用实践/18.png);

取出我在本地的 serverfix 分支，推送到远程仓库的 serverfix 分支中去

若想把远程分支叫作 awesomebranch，可以用`git push origin serverfix:awesomebranch` 来推送数据。

## **取回远程分支的更新**

默认情况下，git fetch取回所有分支(branch)的更新。如果只想取回特定分支的更新，可以指定分支名。
```
$ git fetch <远程主机名> <分支名>
```

比如，取回origin主机的master分支。
```shell
$ git fetch origin master

```

## **合并远程分支**
使用git merge命令或者git rebase命令，在本地分支上合并远程分支。
```shell
$ git merge origin/master
# 或者
$ git rebase origin/master
```

上面命令表示在当前分支上，合并origin/master。

## **删除远程分支**

删除本地和远程的分支：
```
git remote prune origin
```

![images](/git使用实践/19.png);

命令如下：
```shell
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

## **创建标签**
使用组件池时,各个组件或者仓库,都是通过标签来区别功能,这样引用时就可以针对不同版本进行使用.
在提交后,通过git log拿到提交的hash.然后:
```
git tag -a 0.0.11 8c7c2c171fa5be -m"增加yooc课程链接"
```
-a为版本号,-m为描述信息

## **查看标签**
git tag -l即可

## **查看标签具体修改**
```
git show 0.0.11  

```
指定标签名即可.

## **将标签推到远程**

标签创建好以后,通过
```
git push origin 0.0.11
```
指定标签名即可.这样就可以在仓库中看到对应的标签批注了:

![images](/git使用实践/23.png);

## **删除标签**

如果不幸打错了标签,可以通过
```
git tag -d 0.1.11
```
来删除指定标签

## **忽略文件失效**

git可以通过.gitignore文件来配置忽略列表，但是我们有时候配置之后会发现失效。其实是因为缓存的问题，需要手动将git仓库中的对应文件删除，但是本地文件系统中还是存在的。

``` 
find . -iname "demo.css" |xargs git rm -rf --cached
```

## **ssh连接超时**

连接github时,如果出现以下情况
```
ssh: connect to host github.com port 22: Connection timed out
```

则需要在.ssh/文件夹下新建config文本.
首先在终端中打开文件夹:
```
open ~/.ssh
```

然后在该目录下新建config文件:
```
vi config
```
加入如下内容:
```
Host github.com
User 362512489@qq.com
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443
```

然后:wq保存即可.







