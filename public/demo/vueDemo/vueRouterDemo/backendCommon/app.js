import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './components/App.vue';

//使用
Vue.use(VueRouter)


new Vue({
    el:'#app',
    render: h=> h(App)
})
