---
title: RegularUI实例透析
date: 2017-01-15 18:06:19
categories: "Regular"
---

# **前言**
由于regular是具有数据驱动能力的组件化开发框架.故而如何设计组件,以及实现组件的一些技巧与细节就变得尤其重要.
故本文主要参考[RegularUI](https://regular-ui.github.io/index.html),细细体会其RegularUI的一些设计思路,理解其具体实现方式,进行整理,方便日后自己的组件化开发道路.
由于时间和精力,仅对前两个组件dropdown和menu进行自我简单实现,其他组件均以解读和理解吸收为主.

---

# **各种UI**

## dropdown
[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/dropdown.html),下拉菜单组件.
笔者进行了简单的实现:[demo](/demo/pagesDemo/regularui_dropdown.html)
组件字符串模板:
``` html
<div class="u-dropdown {class}" z-dis={disabled} r-hide={!visible} ref="element">
    <div class="dropdown_hd" on-click={this.toggle()}>
        {#if this.$body}
            {#inc this.$body}
        {#else}
            <a class="u-btn" title={title || '下拉菜单'}>{title || '下拉菜单'} <i class="u-icon u-icon-caret-down"></i></a>
        {/if}
    </div>
    <div class="dropdown_bd" r-show={open} r-animation="on: enter; class: animated fadeInY fast; on: leave; class: animated fadeOutY fast;">
        <ul class="m-listview">
            {#list source as item}
            <li z-dis={item.disabled} z-divider={item.divider} title={item.name} on-click={this.select(item)}>{#if @(itemTemplate)}{#inc @(itemTemplate)}{#else}{item.name}{/if}</li>
            {/list}
        </ul>
    </div>
</div>
```

组件核心js逻辑如下:
``` javascript

var Dropdown = SourceComponent.extend({
    name: 'dropdown',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            itemTemplate: null,
            open: false
        });
        this.supr();
    },

    toggle: function(open) {
        if(this.data.disabled)
            return;
        
        if(open === undefined)
            open = !this.data.open;
        this.data.open = open;

        // 根据状态在Dropdown.opens列表中添加/删除管理项
        var index = Dropdown.opens.indexOf(this);
        if(open && index < 0)
            Dropdown.opens.push(this);
        else if(!open && index >= 0)
            Dropdown.opens.splice(index, 1);

        /**
         * @event toggle  展开/收起时触发
         * @property {object} sender 事件发送对象
         * @property {object} open 展开/收起状态
         */
        this.$emit('toggle', {
            sender: this,
            open: open
        });
    },

    select: function(item) {
        if(this.data.disabled || item.disabled || item.divider)
            return;

        /**
         * @event select 选择某一项时触发
         * @property {object} sender 事件发送对象
         * @property {object} selected 当前选择项
         */
        this.$emit('select', {
            sender: this,
            selected: item
        });

        this.toggle(false);
    },
    destroy: function() {
        var index = Dropdown.opens.indexOf(this);
        index >= 0 && Dropdown.opens.splice(index, 1);
        this.supr();
    }
});

```

## menu

多级菜单,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/menu.html)
笔者进行了简单的实现,[demo](/demo/pagesDemo/regularui_menu.html)
menu组件是基于dropdown组件基础上实现的.
menu组件字符串模板:
``` html
<div class="u-dropdown u-menu {class}" z-dis={disabled} r-hide={!visible} ref="element">
    <div class="dropdown_hd" on-click={this.toggle(!open)}>
        {#if this.$body}
            {#inc this.$body}
        {#else}
            <a class="u-btn" title={title || '下拉菜单'}>{title || '多级菜单'} <i class="u-icon u-icon-caret-down"></i></a>
        {/if}
    </div>
    <div class="dropdown_bd" r-show={open} r-animation="on: enter; class: animated fadeInY fast; on: leave; class: animated fadeOutY fast;">
        <!--与dropdown组件的区别在于此次-->
        <menuList source={source} visible />
    </div>
</div>
```
menu组件内嵌了menuList组件,其作用是为了方便层层嵌套.
menu组件js:
``` javascript
var Menu = Dropdown.extend({
    name: 'menu',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            open: false
        });
        this.supr();
        //传递给嵌套的子组件
        this.$ancestor = this;
    }
});
```
menu组件继承于dropdown组件,故方法大致相同.
menu内嵌的menuList组件模板:
``` html
<ul class="m-listview menu_list" r-hide={!visible}>
    {#list source as item}
    <li z-dis={item.disabled} z-divider={item.divider}>
        <div class="menu_item">
            {#if item.childrenCount || (item.children && item.children.length)}
            <i class="u-icon u-icon-caret-right"></i>
            {/if}
            <div class="menu_itemname" title={item.name} on-click={this.select(item)}>{#if @(itemTemplate)}{#inc @(itemTemplate)}{#else}{item.name}{/if}</div>
        </div>
        <!--通过判断数据结构,产生内嵌menuList组件-->
        {#if item.childrenCount || (item.children && item.children.length)}<menuList source={item.children} visible={item.open} parent={item} />{/if}
    </li>
    {/list}
</ul>
```
menuList逻辑如下:
``` javascript
var MenuList = SourceComponent.extend({
    name: 'menuList',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            itemTemplate: null,
            // visible: false
        });
        this.supr();
        //引用父组件
        this.$ancestor = this.$parent.$ancestor;
        this.service = this.$ancestor.service;
        this.data.itemTemplate = this.$ancestor.data.itemTemplate;
    },
    /**
     * @note 移交$ancestor处理
     */
    select: function() {
        //调用父组件的select方法
        this.$ancestor.select.apply(this.$ancestor, arguments);
    }
});
```

## checkgroup
多选组组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/checkgroup.html)
checkgroup组件本身的实现较为简单,其模板如下:
``` html
<div class="u-unitgroup {class}" r-hide={!visible}>
    {#list source as item}
    <label class="u-check2" title={item.name} z-dis={disabled} r-class={ {'u-check2-block': block} }><input type="checkbox" class="u-check" r-model={item.checked} disabled={disabled}> {item.name}</label>
    {/list}
</div>
```

核心逻辑如下:

``` javascript
var CheckGroup = SourceComponent.extend({
    name: 'checkGroup',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            block: false
        });
        this.supr();
    }
});
```

值得一提的是,全选功能用到的**计算属性**这一特性:
``` html
<label><input type="checkbox" class="u-check" r-model={checkedAll}> 全选</label>
<checkGroup source={source} />
```

``` javascript
var component = new RGUI.Component({
    template: template,
    data: {
        source: [
            {name: '选项1'},
            {name: '选项2'},
            {name: '选项3'},
            {name: '选项4'},
            {name: '选项5'},
            {name: '选项6'}
        ]
    },
    //使用计算属性来完成全选功能
    computed: {
        checkedAll: {
            get: function() {
                var source = this.data.source;
                return source.filter(function(item) {
                    return item.checked;
                }).length === source.length;
            },
            set: function(value) {
                this.data.source.forEach(function(item) {
                    item.checked = !!value;
                })
            }
        }
    }
});
```

## radiogroup
单选组组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/radiogroup.html)
radiogroup组件本身的实现与checkgroup较为类似,其模板如下:
``` html
<div class="u-unitgroup {class}" r-hide={!visible}>
    {#list source as item}
    <label class="u-radio2" title={item.name} z-dis={disabled} r-class={ {'u-radio2-block': block} } on-click={this.select(item)}><input type="radio" class="u-radio" name={_radioGroupId} disabled={disabled}> {item.name}</label>
    {/list}
</div>
```

核心逻辑如下:

``` javascript
var RadioGroup = SourceComponent.extend({
    name: 'radioGroup',
    template: template,

    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            selected: null,
            _radioGroupId: new Date()
        });
        this.supr();
    },

    select: function(item) {
        if(this.data.readonly || this.data.disabled)
            return;

        this.data.selected = item;
        //出发组件的自定义事件select
        this.$emit('select', {
            sender: this,
            selected: item
        });
    }
});
```

## **select2**
选择项组件,[官方](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/select2.html)
select2组件继承与dropdown组件,其模板如下:
``` html
<div class="u-dropdown u-select2 {class}" z-dis={disabled} r-hide={!visible} ref="element">
    <div class="dropdown_hd" title={selected ? selected.name : placeholder} on-click={this.toggle(!open)}>
        <i class="u-icon u-icon-caret-down"></i>
        <span>{selected ? selected.name : placeholder}</span>
    </div>
    <div class="dropdown_bd" r-show={open} r-animation="on: enter; class: animated fadeInY fast; on: leave; class: animated fadeOutY fast;">
        <ul class="m-listview">
            <!--默认选中项-->
            {#if placeholder}<li z-sel={!selected} on-click={this.select(undefined)}>{placeholder}</li>{/if}
            <!--选择项-->
            {#list source as item}
            <li z-sel={selected === item} z-dis={item.disabled} z-divider={item.divider} title={item.name} on-click={this.select(item)}>{#if @(itemTemplate)}{#inc @(itemTemplate)}{#else}{item.name}{/if}</li>
            {/list}
        </ul>
    </div>
</div>
```

核心逻辑如下:
``` javascript
var Select2 = Dropdown.extend({
    name: 'select2',
    template: template,
    /**
     * @protected
     */
    config: function() {

        _.extend(this.data, {
            // @inherited source: [],
            // @inherited open: false
            //选中项
            selected: undefined,
            key: 'id',
            //选中值
            value: undefined,
            placeholder: '请选择'
        });
        this.supr();
        //监听selected的值,如果改变则执行回调
        this.$watch('selected', function(newValue, oldValue) {
            //更新value的值
            this.data.value = newValue ? newValue[this.data.key] : newValue;
            //出发change事件
            this.$emit('change', {
                sender: this,
                selected: newValue,
                key: this.data.key,
                value: this.data.value
            });
        });
        //监听value的值
        this.$watch('value', function(newValue, oldValue) {
            if(newValue === undefined || newValue === null)
                return this.data.selected = newValue;

            if(this.data.source) {
                if(!this.data.selected || this.data.selected[this.data.key] !== newValue)
                    this.data.selected = this.data.source.find(function(item) {
                        return item[this.data.key] == newValue;
                    }, this);
            }
        });
        //监听source
        this.$watch('source', function(newValue, oldValue) {
            if(newValue === undefined)
                return this.data.selected = undefined;

            if(!(newValue instanceof Array))
                throw new TypeError('`source` is not an Array!');

            if(newValue.length && (typeof newValue[0] === 'string' || typeof newValue[0] === 'number'))
                return this.data.source = newValue.map(function(name, index) {
                    return {id: index, name: name};
                });


            if(this.data.value !== undefined && this.data.value !== null) {
                this.data.selected = newValue.find(function(item) {
                    return item[this.data.key] == this.data.value;
                }, this);
            } else if(this.data.selected && newValue.indexOf(this.data.selected) < 0)
                this.data.selected = undefined;

            // 当placeholder为空时，自动选择第一项
            if(!this.data.placeholder && !this.data.selected)
                this.data.selected = newValue[0];
        });
    },
    /**
     * @method select(item) 选择某一项
     * @public
     * @param  {object} item 选择项
     * @return {void}
     */
    select: function(item) {
        if(this.data.readonly || this.data.disabled || (item && (item.disabled || item.divider)))
            return;
        //将当前设置为选中项
        this.data.selected = item;

        /**
         * @event select 选择某一项时触发
         * @property {object} sender 事件发送对象
         * @property {object} selected 当前选择项
         */
        //触发select事件
        this.$emit('select', {
            sender: this,
            selected: item
        });

        this.toggle(false);
    }
});
```

其中对selected与value的脏检查,强化了组件的数据绑定能力:
``` html
<select2 source={source} selected={selected} value={value} />
    当前选择项：{selected ? selected.name : 'undefined'}，当前选择值：{value || 'undefined'}
```

## select2group
多级选择组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/select2group.html)
基于select2组件,其模板文件如下:
``` html
<div class="u-select2group {class}" r-hide={!visible}>
    {#list 0..(depth - 1) as i}
    <select2 source={sources[i]} selected={selecteds[i]} key={key} value={values[i]} readonly={readonly} disabled={disabled} placeholder={placeholders[i]} on-change={this._onChange($event.selected, i)} />
    {/list}
</div>
```

其实就是通过组件的depth属性加载多个select2组件,并以数组的形式来区分各个组件的驱动数据.

核心逻辑如下:

``` javascript
var Select2Group = Component.extend({
    name: 'select2Group',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            depth: 1,
            sources: [],
            selected: undefined,
            selecteds: [],
            key: 'id',
            values: [],
            placeholders: []
        });
        this.supr();

        this.$watch('selected', function(newValue, oldValue) {
            /**
             * @event change 最后的选择项改变时触发
             */
            this.$emit('change', {
                sender: this,
                selected: newValue,
                selecteds: this.data.selecteds,
                key: this.data.key,
                values: this.data.values
            });
        });

        this.data.sources[0] = this.data.source;
    },
    /**
     * @private
     */
    _onChange: function(item, level) {
        // 由内部<select2>控制
        // if(this.data.readonly || this.data.disabled || (item && (item.disabled || item.divider)))
        //     return;
        //根据该组件的选择,动态调整后的的select2组件的值
        this.data.sources[level + 1] = item ? item.children : undefined;
        for(var i = level + 2; i < this.data.depth; i++)
            this.data.sources[i] = undefined;

        if(level === this.data.depth - 1)
            this.data.selected = item;

        /**
         * @event select 选择某一项时触发
         */
        this.$emit('select', {
            sender: this,
            selected: item,
            selecteds: this.data.selecteds,
            level: level
        });
    },
});
```

其中主要是联动选择功能,我们使用该组件时会传入树形数据:

``` javascript
var component = new RGUI.Component({
    template: template,
    data: {
        source: [
            {name: '理学', children: [
                {name: '物理学', children: [
                    {name: '理论物理'},
                    {name: '凝聚态物理'},
                    {name: '材料物理'}
                ]},
                {name: '数学', children: [
                    {name: '基础数学'},
                    {name: '计算数学'},
                    {name: '应用数学'}
                ]},
                {name: '化学'}
            ]},
            {name: '工学', children: [
                {name: '计算机科学与技术', children: [
                    {name: '计算机系统结构'},
                    {name: '计算机软件与理论'},
                    {name: '计算机应用技术'}
                ]},
                {name: '软件工程'},
                {name: '机械工程', children: [
                    {name: '机械制造及其自动化'},
                    {name: '机械电子工程'},
                    {name: '机械设计及理论'},
                    {name: '车辆工程'}
                ]}
            ]}
        ]
    }
});
```

然后我们在on-change事件中通过选择项来决定下一选择项的数据来源,也就是其children.

## suggest
自动提示组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/suggest.html)
suggest组件,继承于dropdown组件,其结构如下:
``` html
<div class="u-dropdown u-suggest {class}" z-dis={disabled} r-hide={!visible} ref="element">
    <div class="dropdown_hd">
        <input class="u-input u-input-full" placeholder={placeholder} maxlength={maxlength} autofocus={autofocus} r-model={value} on-focus={this._onInput($event)} on-keyup={this._onInput($event)} on-blur={this._onBlur($event)} ref="input" readonly={readonly} disabled={disabled}>
    </div>
    <div class="dropdown_bd" r-show={open} r-animation="on: enter; class: animated fadeInY fast; on: leave; class: animated fadeOutY fast;">
        <ul class="m-listview">
            {#list source as item}
            <!--通过filter函数过滤符合查询条件的值-->
            {#if this.filter(item)}
                <li z-dis={item.disabled} z-divider={item.divider} title={item.name} on-click={this.select(item)}>{#if @(itemTemplate)}{#inc @(itemTemplate)}{#else}{item.name}{/if}</li>
            {/if}
            {/list}
        </ul>
    </div>
</div>
```

核心逻辑如下:
``` javascript
var Suggest = Dropdown.extend({
    name: 'suggest',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            // @inherited source: [],
            // @inherited open: false,
            selected: null,
            value: '',
            placeholder: '请输入',
            maxlength: undefined,
            startLength: 0,
            delay: 300,
            matchType: 'all',
            strict: false,
            autofocus: false
        });
        this.supr();
    },
    /**
     * @private
     */
    _onInput: function($event) {
        var value = this.data.value;

        if(value.length >= this.data.startLength) {
            this.toggle(true);
            //如果存在远程接口调用,则更新数据源source
            if(this.service)
                this.$updateSource();
        } else
            this.toggle(false, true);
    },
    /**
     * @private
     */
    _onBlur: function($event) {

    },
    /**
     * @private
     */
    getParams: function() {
        return {value: this.data.value};
    },
    /**
     * @private
     */
    filter: function(item) {
        //过滤函数,用来得到符合查询范围的值
        var value = this.data.value;

        if(!value && this.data.startLength)
            return false;
        //根据不同的匹配方式,采用不同方案匹配
        if(this.data.matchType === 'all')
            return item.name.indexOf(value) >= 0;
        else if(this.data.matchType === 'startLength')
            return item.name.slice(0, value.length) === value;
        else if(this.data.matchType === 'end')
            return item.name.slice(-value.length) === value;
    }
});
```

## uploader
文件上传组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsunit/uploader.html)
主要原理是表单上传文件,然后通过iframe来接受返回的结果.
模板结构如下:
``` html
<div class="u-uploader {class}" r-hide={!visible}>
    <div on-click={this.upload()}>
        <!--自定义按钮内容-->
        {#if this.$body}
            {#inc this.$body}
        {#else}
        <!--上传按钮-->
            <a class="u-btn">{title || '上传'}</a>
        {/if}
    </div>
    <!--隐藏表单-->
    <form method="POST" action={url} target="iframe{_id}" enctype={contentType} ref="form">
        {#if !_sending}
        <!-- IE需要重置input[type=file] -->
        <input type="file" name={name} ref="file" on-change={this._submit()}>
        {/if}
        {#list Object.keys(data) as key}
        <input type="hidden" name={key} value={data[key]}>
        {/list}
    </form>
    <!--form提交后返回的内容到其target,即该iframe-->
    <iframe name="iframe{_id}" on-load={this._onLoad()} ref="iframe" />
</div>
```

可以看到,通过u-btn按钮出发表单的提交,再通过form的target指定对应的iframe来反映响应结果.
uploader组件核心逻辑如下:
``` javascript
var Uploader = Component.extend({
    name: 'uploader',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            title: '',
            url: '',
            contentType: 'multipart/form-data',
            dataType: 'json',
            data: {},
            name: 'file',
            extensions: null,
            maxSize: '',
            _sending: false,
            _id: new Date().getTime()
        });
        this.supr();
    },
    /**
     * @method upload() 弹出文件对话框并且上传文件
     */
    upload: function() {
        if(this.data.disabled || this.data._sending)
            return;
        //提交表单
        this.$refs.file.click();
    },
    //检查文件后缀
    _checkExtensions: function(file) {
        //如果未设置限制,则跳过
        if(!this.data.extensions)
            return true;

        var fileName = file.name;
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();

        var extensions = this.data.extensions;
        if(typeof extensions === 'string')
            extensions = extensions.split(',');
        //如果文件后缀不在限制列表中,通过
        if(extensions.indexOf(ext) >= 0)
            return true;
        //否则,触发错误事件
        this.$emit('error', {
            sender: this,
            name: 'ExtensionError',
            message: '只能上传' + extensions.join(', ')　+ '类型的文件！',
            extensions: extensions
        });

        return false;
    },
    //检查文件大小
    _checkSize: function(file) {
        if(!this.data.maxSize && this.data.maxSize !== 0)
            return true;

        var maxSize;
        if(!isNaN(this.data.maxSize))
            maxSize = +this.data.maxSize;
        else {
            var unit = this.data.maxSize.slice(-2);
            //识别认可单位列表
            if(!SIZE_UNITS[unit])
                throw new Error('Unknown unit!');
            //对应单位进行转换
            maxSize = this.data.maxSize.slice(0, -2)*SIZE_UNITS[unit];
        }
        //通过file.size对文件大小进行判断
        if(file.size <= maxSize)
            return true;

        this.$emit('error', {
            sender: this,
            name: 'SizeError',
            message: '文件大小超出限制！',
            maxSize: this.data.maxSize,
            size: file.size
        });

        return false;
    },
    /**
     * @method _submit() 提交表单
     */
    _submit: function() {
        //通过form读取到文件信息
        var file = this.$refs.file.files ? this.$refs.file.files[0] : {
            name: this.$refs.file.value,
            size: 0
        };
        //检查后缀和文件大小
        if(!file || !file.name || !this._checkExtensions(file) || !this._checkSize(file))
            return;

        this.data._sending = true;
        /**
         * @event sending 发送前触发
         */
        this.$emit('sending', {
            sender: this,
            data: this.data.data
        });
        //进行表单提交,对输入的指定url进行post请求
        this.$refs.form.submit();
    },
    //文件上传post请求的返回后
    _onLoad: function() {
        var $iframe = this.$refs.iframe;
        var $file = this.$refs.file;

        if(!this.data._sending)
            return;
        this.data._sending = false;

        var xml = {};
        if($iframe.contentWindow) {
            xml.responseText = $iframe.contentWindow.document.body ? $iframe.contentWindow.document.body.innerText : null;
            xml.responseXML = $iframe.contentWindow.document.XMLDocument ? $iframe.contentWindow.document.XMLDocument : $iframe.contentWindow.document;
        } else if($iframe.contentDocument) {
            xml.responseText = $iframe.contentDocument.document.body ? $iframe.contentDocument.document.body.innerText : null;
            xml.responseXML = $iframe.contentDocument.document.XMLDocument ? $iframe.contentDocument.document.XMLDocument : $iframe.contentDocument.document;
        }

        if(!xml.responseText) {
            /**
             * @event error 上传错误时触发
             */
            return this.$emit('error', {
                sender: this,
                name: 'ResponseError',
                message: 'No responseText!'
            });
        }

        /**
         * @event complete 上传完成时触发
         */
        this.$emit('complete', {
            sender: this,
            xml: xml
        });

        /**
         * @event success 上传成功时触发
         */
        this.$emit('success', {
            sender: this,
            //如果上传成功,则解析数据
            data: this._parseData(xml, this.data.dataType)
        });
    },
    /**
     * @method _parseData(xml, type) 解析接收的数据
     */
    _parseData: function(xml, type) {
        //这里进行一些兼容性处理
        if(type === 'text')
            return xml.responseText;
        else if(type === 'xml')
            return xml.responseXML;
        else if (type === 'json') {
            var data = xml.responseText;
            try {
                data = JSON.parse(data);
            } catch (e) {}

            return data;
        } else if(type === 'script')
            return eval(xml.responseText);
        else
            return xml.responseText;
    }
});
```

## tabs
选项卡组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsmodule/tabs.html)
一个最为简单的选项卡模块有tabs和tab组件组成,使用展示:
``` html
<tabs>
    <tab title="Tab1">Content1</tab>
    <tab title="Tab2">Content2</tab>
    <tab title="Tab3">Content3</tab>
    <tab title="Tab4">Content4</tab>
</tabs>
```

tabs的结构如下:
``` html
<div class="m-tabs {class}" z-dis={disabled} r-hide={!visible}>
    <ul class="tabs_hd">
        <!--生成切换列表-->
        {#list tabs as item}
        <li z-crt={item == selected} z-dis={item.data.disabled} on-click={this.select(item)}>{#if @(titleTemplate)}{#inc @(titleTemplate)}{#else}{item.data.title}{/if}</li>
        {/list}
    </ul>
    <div class="tabs_bd">
        <!--引入组件内容-->
        {#inc this.$body}
    </div>
</div>
```

两个组件的逻辑如下:
``` javascript
var Tabs = Component.extend({
    name: 'tabs',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            tabs: [],
            selected: undefined,
            titleTemplate: null
        });
        this.supr();

        this.$watch('selected', function(newValue, oldValue) {
            //触发change事件
            this.$emit('change', {
                sender: this,
                selected: newValue
            });
        });
    },
    //选择某一项
    select: function(item) {
        if(this.data.readonly || this.data.disabled || item.data.disabled)
            return;
        //设置选中项为当前项
        this.data.selected = item;
        this.$emit('select', {
            sender: this,
            selected: item
        });
    }
});

var Tab = Component.extend({
    name: 'tab',
    //通过$outer访问父节点
    template: '<div r-hide={this.$outer.data.selected !== this}>{#inc this.$body}</div>',
    config: function() {
        _.extend(this.data, {
            title: ''
        });
        this.supr();
        //对父节点进行操作,将当前tab加入tabs组件的列表
        if(this.$outer)
            this.$outer.data.tabs.push(this);

        if(!this.$outer.data.selected)
            this.$outer.data.selected = this;
    }
});
```

这里值得一提的是,tab组件通过this.$outer访问其视觉父节点也就是tabs组件.
以及tabs组件通过this.$body,载入组件内部结构至模板中.

## pager
分页组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsmodule/pager.html)
分页组件pager非常常见.
其结构如下:
``` javascript
<ul class="m-pager m-pager-{@(position)} {class}" z-dis={disabled} r-hide={!visible}>
    <!--上一页-->
    <li class="pager_prev" z-dis={current <= 1} on-click={this.select(current - 1)}><a>上一页</a></li>
    <!--判断是否需要省略号-->
    {#if total - middle > side * 2 + 1}
        {#list 1..side as i}
        <li z-crt={current == i} on-click={this.select(i)}><a>{i}</a></li>
        {/list}
        <!--如果中部可选部分起始位置和左边side间距一个以上,则出现省略号-->
        {#if _start > side + 1}<li><span>...</span></li>{/if}
        {#list _start.._end as i}
        <li z-crt={current == i} on-click={this.select(i)}><a>{i}</a></li>
        {/list}
        <!--如果中部可选部分终止位置和右边side间距一个以上,则出现省略号-->
        {#if _end < total - side}<li><span>...</span></li>{/if}
        {#list (total - side + 1)..total as i}
        <li z-crt={current == i} on-click={this.select(i)}><a>{i}</a></li>
        {/list}
    {#else}
        <!--不需要省略号-->
        {#list 1..total as i}
        <li z-crt={current == i} on-click={this.select(i)}><a>{i}</a></li>
        {/list}
    {/if}
    <!--下一页-->
    <li class="pager_next" z-dis={current >= total} on-click={this.select(current + 1)}><a>下一页</a></li>
</ul>
```


主要是start和end,非常关键,他们决定了省略号的出现与否.
pager的主要逻辑如下:
``` javascript
var Pager = Component.extend({
    name: 'pager',
    template: template,
    /**
     * @protected
     */
    config: function() {
        _.extend(this.data, {
            current: 1,
            total: 11,
            position: 'center',
            middle: 5,
            side: 2,
            _start: 1,
            _end: 5
        });
        this.supr();

        this.$watch(['current', 'total'], function(current, total) {
            this.data.current = current = +current;
            this.data.total = total = +total;
            var show = this.data.middle>>1;
            var side = this.data.side;
            //初始化start和end,方便模板中省略号出现情况
            this.data._start = current - show;
            this.data._end = current + show;
            if(this.data._start < side + 1)
                this.data._start = side + 1;
            if(this.data._end > total - side)
                this.data._end = total - side;
            if(current - this.data._start < show)
                this.data._end += this.data._start - current + show;
            if(this.data._end - current < show)
                this.data._start += this.data._end - current - show;
        });

        this.$watch(['middle', 'side'], function(middle, side) {
            this.data.middle = +middle;
            this.data.side = +side;
        });
    },
    //选中事件
    select: function(page) {
        if(this.data.readonly || this.data.disabled)
            return;
        //判断合适范围
        if(page < 1) return;
        if(page > this.data.total) return;
        if(page == this.data.current) return;

        this.data.current = page;
        //触发select事件
        this.$emit('select', {
            sender: this,
            current: this.data.current
        });
    }
});
```
这里值得一提的是,除了必须用到的数据,还使用状态变量_start,_end来对组件的状态显示进行判断.这也是数据驱动型组件的必须方式.

## modal
模态框组件,[官方demo](/demo/NetEaseDemo/src/javascript/lib/regular-ui/doc/jsmodule/modal.html)
modal组件是任何系统的常用组成部分.看其结构:
``` html
<div class="m-modal {class}" r-hide={!visible}>
    <div class="modal_dialog" ref="modalDialog">
        <draggable disabled={!draggable} proxy={this.$refs.modalDialog} on-dragstart={this._onDragStart($event)}>
        <div class="modal_hd">
            <!--关闭-->
            <a class="modal_close" on-click={this.close(!cancelButton)}><i class="u-icon u-icon-close"></i></a>
            <h3 class="modal_title">{title}</h3>
        </div>
        </draggable>
        <div class="modal_bd">
            <!--中部自定义内容-->
            {#if contentTemplate}{#inc @(contentTemplate)}{#else}{content}{/if}
        </div>
        <div class="modal_ft">
            <!--确定按钮-->
            {#if okButton}
            <button class="u-btn u-btn-primary" on-click={this.close(true)} r-autofocus>{okButton === true ? '确定' : okButton}</button>
            {/if}
            <!--取消按钮-->
            {#if cancelButton}
            <button class="u-btn" on-click={this.close(false)}>{cancelButton === true ? '取消' : cancelButton}</button>
            {/if}
        </div>
    </div>
</div>
```

其中的draggable为另一拖拽组件,暂不用管.
再看看modal组件的逻辑部分:
``` javascript
var Modal = Component.extend({
    name: 'modal',
    template: template,
    config: function() {
        _.extend(this.data, {
            title: '提示',
            content: '',
            okButton: true,
            cancelButton: false,
            draggable: false
        });
        this.supr();
    },
    init: function() {
        this.supr();
        // 如果不是内嵌组件，则嵌入到document.body中
        if(this.$root === this)
            this.$inject(document.body);
    },
    close: function(result) {
        //关闭框,需要判断到底执行哪个方法
        this.$emit('close', {
            result: result
        });
        result ? this.ok() : this.cancel();
    },
    ok: function() {
        this.$emit('ok');

        this.destroy();
    },

    cancel: function() {
        this.$emit('cancel');

        this.destroy();
    },
    _onDragStart: function($event) {
        var dialog = $event.proxy;
        dialog.style.left = dialog.offsetLeft + 'px';
        dialog.style.top = dialog.offsetTop + 'px';
        dialog.style.zIndex = '1000';
        dialog.style.position = 'absolute';
    }
});
//组件拓展--alert框
Modal.alert = function(content, title, okButton) {
    var modal = new this({
        data: {
            content: content,
            title: title,
            okButton: okButton
        }
    });

    return modal;
}
//组件拓展--confirm框
Modal.confirm = function(content, title, okButton, cancelButton) {
    var modal = new this({
        data: {
            content: content,
            title: title,
            okButton: okButton,
            cancelButton: cancelButton || true
        }
    });

    return modal;
}
```

这里值得一提的是,通过Modal.alert和Modal.confirm方法,传入不同数据给Modal,从而对组件进行拓展.然后根据不同的数据okButton和cancelButton,在模板中进行对应结构的调整.




