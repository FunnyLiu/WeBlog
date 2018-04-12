/**
 * ------------------------------------------------------------
 * Tabs       选项卡
 * @author   sensen(rainforest92@126.com)
 * ------------------------------------------------------------
 */

'use strict';

var Component = require('regular-ui-base/src/component');
var template = require('./tabs.html');
var _ = require('regular-ui-base/src/_');

/**
 * @class Tabs
 * @extend Component
 * @param {object}                  options.data                     =  绑定属性
 * @param {object=null}             options.data.selected           <=> 当前选择卡
 * @param {string=null}             options.data.titleTemplate      @=> 标题模板
 * @param {boolean=false}           options.data.readonly            => 是否只读
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
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

module.exports = Tabs;