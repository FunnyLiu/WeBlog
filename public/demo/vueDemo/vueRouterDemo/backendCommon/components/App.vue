<template>
    <div>
        <div>呵呵</div>
        <a @click="changeUserId">某一用户</a>

        <router-view class="m-view-a"></router-view> 
        <router-view class="m-view-b" name="nav"></router-view> 
        <router-view class="m-view-c" name="content"></router-view> 

        <bottom-info :info="info"></bottom-info>
    </div>
    
</template>

<script>

import VueRouter from 'vue-router';

import User from './User.vue';
import Nav from './Nav.vue';
import Content from './Content.vue';
import ContentA from './ContentA.vue';
import ContentB from './ContentB.vue';
import bottomInfo from './bottomInfo.vue';




const router = new VueRouter({
    routes: [
        { 
            path: '/:id', 
            components: {
                default:User,
                nav:Nav,
                content:Content
            }, 
            props: {
                default:true,
                nav:true
            },
            children:[
                {
                    path:'content',
                    component:ContentA
                },
                {
                    path:'content/contenta',
                    component:ContentA
                },
                {
                    path:'content/contentb',
                    component:ContentB
                }
            ] 
        }
    ]
})
//全局导航守卫
router.beforeEach(function(to, from, next){
    document.title = to.fullPath;
    //必须由next，否则停止
    next();
}.bind(this))



export default {
    router,
    data(){
        return {
            info:''
        }
    },
    methods:{
        changeUserId:function(){
            let id = Math.floor(Math.random()*10000);

            //js变pushstate
            this.$router.push(`/${id}`);
        }
    },
    components:{
        bottomInfo
    }
        
}
</script>
