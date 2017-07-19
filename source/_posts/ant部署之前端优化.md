---
title: ant部署之前端优化
date: 2017-06-02 11:25:30
categories: "ant"
---
# 前言
主要围绕基于java的web应用中，在使用Ant进行部署测试环境、预发环境、线上环境时，针对前端工程的一些优化。
主要是围绕build.xml构建文件来进行的，如果不熟悉语法，可以看看[之前的文章](/2017/05/31/ant构建之build-xml详解/#more)

# 准备工作
这里的优化思路是从企业的工程实践中得来的，故而先简单介绍下项目的环境部署情况。
这里多个项目部署到一个服务器中的一个文件夹中，然后再在各个项目自己的文件夹下以不同的环境，分为不同文件夹。
比如：
```yml
# 不同环境文件夹名称
test_dir = build_studyTest
pre_dir = build_study-product-pre
online_dir = build_study-product
```

# 部署文件结构
关于部署的配置，文件结构如下图：
- build.properties
- env-judge.xml
- real-build.xml
- tasks.xml

我们放在各个服务器上构建的文件build.xml，只需要指向各个项目自己的real-build.xml即可。
下面一一进行介绍。

# build.properties
用来存放各种变量：
```yml
# 部署根路径
root_dir = /home/omad/omad

# 不同环境文件夹名称
test_dir = build_studyTest
pre_dir = build_study-product-pre
online_dir = build_study-product

# 测试(开发)-产品线-omad名称
test_study = front-study

# 预发-产品线-omad名称
pre_study = front-study

# 线上-产品线-omad名称
online_study = front-study


# 打包后存放文件夹
compress.dir = compressed

# 前端代码目录
web.dir = src/main/webapp

# 打包脚本
nej = node_modules/nej/bin/nej.js

# node版本
study-node = /home/omad/study/node/v4.8.1/bin/node

# bower cache clean
is_bower_cache_clean = true

# delete css dir
is_css_delete = true

```

# env-build.xml
用来判断当前是在构建哪个环境的工程：
```xml
<project>
<!--首先通过build.properties中提供的常量，对测试、预发、线上环境的路径进行正则定义-->
    <regexp id="regexp_env_test" pattern="^${root_dir}/${test_dir}/.+"/>
    <regexp id="regexp_env_pre" pattern="^${root_dir}/${pre_dir}/.+"/>
    <regexp id="regexp_env_online" pattern="^${root_dir}/${online_dir}/.+"/>

    <regexp id="regexp_study" pattern="^${root_dir}/.+?/(${test_study}|${pre_study}|${online_study})/.+"/>

<!--如果定义的路径符合正则匹配的，则对应的标准变量设置为true-->
    <condition property="is_test">
        <matches string="${basedir}">
            <regexp refid="regexp_env_test"/>
        </matches>
    </condition>

    <condition property="is_pre">
        <matches string="${basedir}">
            <regexp refid="regexp_env_pre"/>
        </matches>
    </condition>

    <condition property="is_online">
        <matches string="${basedir}">
            <regexp refid="regexp_env_online"/>
        </matches>
    </condition>

    <condition property="is_online_pre">
        <or>
            <istrue value="${is_online}"/>
            <istrue value="${is_pre}"/>
        </or>
    </condition>

    <condition property="is_study">
        <matches string="${basedir}">
            <regexp refid="regexp_study"/>
        </matches>
    </condition>

    <!--study-->
    <condition property="is_test_study">
        <and>
            <istrue value="${is_test}"/>
            <istrue value="${is_study}"/>
        </and>
    </condition>

    <condition property="is_online_pre_study">
        <and>
            <istrue value="${is_online_pre}"/>
            <istrue value="${is_study}"/>
        </and>
    </condition>

</project>
```

# real-build.xml
将环境所在的标识变量设置为true之后，就可以去执行对应的任务了
```xml
<project>
    <!--property 相对与basedir，include、import相对于当前文件位置-->
    <property file="./omad/build.properties"/>
    <property name="nej-build.js" value="${basedir}/${nej}"/>
    
    <!--引入环境判断逻辑和每个任务具体的操作-->
    <import file="./env-judge.xml"/>
    <import file="./tasks.xml"/>

    <target name="real_task">
        <echo message="begin real_task......"/>
        <!--并行处理任务-->
        <parallel failonany="true">
            <antcall target="clean"/>
            <!--根据配置-->
            <antcall target="bower_cache_clean"/>
            <antcall target="delete-css"/>
        </parallel>

        <parallel failonany="true">
            <antcall target="bower_install"/>
            <antcall target="cnpm_install"/>
        </parallel>

        <parallel failonany="true">
            <antcall target="sync_module"/>
            <antcall target="build_style"/>
        </parallel>

        <echo message="begin copy ${web.dir} to compressed......"/>
        <copy todir="${compress.dir}" preservelastmodified="true">
            <fileset dir="${basedir}/${web.dir}"/>
        </copy>

        <!--只有条件的满足才执行-->
        <antcall target="nej_build_test_study"/>
        <antcall target="nej_build_online_pre_study"/>

        <echo message="全部优化后总耗时为："/>
    </target>
</project>
```

# tasks.xml
最后来看看，前端工程部署时，需要执行的具体任务有哪些。
所有通过bower安装下来的组件均位于lib文件夹，所有使用nej打包而来的前端脚本和资源为与pub、h和s文件夹。所有通过bower安装下来的模块module均位于module-*文件夹。
clean任务就是将这些内容删除。
bower_cache_clean是通过build.properties中的is_bower_cache_clean来决定是否清除bower缓存。
delete-css是将老的css文件删除。
bower_install用来下载项目依赖的组件池中的组件。
cnpm_install用来下载项目依赖的npm模块。
sync_module用来将bower下载下来的模块子项目复制到工程中，方便工程打包整合。
build_style是通过gulp来编译scss为css文件。
nej_build_test_study和nej_build_online_pre_study是根据不同的环境，执行不同的nej打包任务，这里其实都是执行nej_build_study任务，只不过参数不同。
nej_build_study根据参数不同，选择不同的配置文件进行nej的打包工作。


```xml
<project>

    <!--clean-->
    <target name="clean">
        <echo message="begin clean..."/>
        <echo message="begin delete lib "/>
        <delete dir="${basedir}/${web.dir}/lib"/>

        <delete dir="${basedir}/node_modules/gulp-shell"/>

        <echo message="begin delete pub、h、s..."/>
        <delete dir="${basedir}/${web.dir}/pub"/>
        <delete dir="${basedir}/${web.dir}/h"/>
        <delete dir="${basedir}/${web.dir}/s"/>

        <delete dir="${basedir}/${compress.dir}"/>
        <delete file="${basedir}/tools/publish/names.json"/>
        <delete file="${basedir}/tools/newPublish/names.json"/>

        <echo message="begin clean html module-xx..."/>
        <delete includeemptydirs="true">
            <fileset dir="${basedir}/${web.dir}/src/html" >
                <include name="**/module-*/**"/>
            </fileset>
        </delete>

        <echo message="begin clean res/module-xx、component-xx、res-base..."/>
        <delete includeemptydirs="true">
            <fileset dir="${basedir}/${web.dir}/res" >
                <include name="module-*/**"/>
                <include name="component-*/**"/>
                <include name="res-base/**"/>
            </fileset>
        </delete>
    </target>

    <!--npm install-->
    <target name="cnpm_install">
        <echo message="begin cnpm_install..."/>
        <exec dir="." executable="cnpm" failonerror="true">
            <arg line="--registry=http://rnpm.hz.netease.com/ --registryweb=http://npm.hz.netease.com/  --cache=/home/omad/.nenpm/.cache --userconfig=/home/omad/.nenpmrc  install"/>
        </exec>
    </target>

    <!--delete css-->
    <target name="delete-css" if="${is_css_delete}">
        <echo message="begin delete css "/>
        <delete dir="${basedir}/${web.dir}/src/css"/>
    </target>

    <!--build style-->
    <target name="build_style">
        <echo message="begin build_style..."/>
        <exec dir="." executable="gulp" failonerror="true">
            <arg line="scss"/>
        </exec>
    </target>

    <!--bower cache clean if必须是${]才是判断true,false, 否则只要有设定值即可执行-->
    <target name="bower_cache_clean" if="${is_bower_cache_clean}">
        <echo message="begin bower_cache_clean ..."/>
        <exec dir="." executable="bower" failonerror="true">
            <arg line="cache clean" />
        </exec>
    </target>

    <!--bower install-->
    <target name="bower_install">
        <echo message="begin bower_install ..."/>
        <exec dir="." executable="bower" failonerror="true">
            <arg line="install " />
        </exec>
    </target>

    <!--sync module-->
    <target name="sync_module_item">
        <echo message="begin sync_module ${html.dir}..."/>
        <copy todir="${basedir}/${web.dir}/src/html/${html.dir}" overwrite="true" includeEmptyDirs="true">
            <fileset dir="${basedir}/${web.dir}/lib">
                <include name="module-*/**" />
            </fileset>
        </copy>
    </target>

    <target name="sync_module">
        <parallel failonany="true">
            <antcall target="sync_module_item">
                <param name="html.dir" value="newm"/>
            </antcall>
        </parallel>
    </target>

    <!-- study -->
    <target name="nej_build_study">
        <echo message="begin  nej_build_study ${build_type}..."/>
        <parallel failonany="true">
            <exec dir="." executable="${study-node}" failonerror="true">
                <arg line="${nej-build.js} build ${basedir}/tools/newPublish/release${build_type}.conf -l info"/>
            </exec>
            <exec dir="." executable="${study-node}" failonerror="true">
                <arg line="${nej-build.js} build ${basedir}/tools/publish/release${build_type}.conf -l info"/>
            </exec>
            <exec dir="." executable="${study-node}" failonerror="true">
                <arg line="${nej-build.js} build ${basedir}/tools/publish/mobile_release${build_type}.conf -l info"/>
            </exec>
        </parallel>
    </target>

    <target name="nej_build_test_study" if="${is_test_study}">
        <antcall target="nej_build_study">
            <param name="build_type" value="_dev"/>
        </antcall>
    </target>

    <target name="nej_build_online_pre_study" if="${is_online_pre_study}">
        <antcall target="nej_build_study">
            <param name="build_type" value=""/>
        </antcall>
    </target>


</project>
```

# 后记
一个前端项目的部署，差不多就是基于上面所提到的一些流程了。当然，不同的技术栈，对应的细节不同，但是思想都是一致的。
