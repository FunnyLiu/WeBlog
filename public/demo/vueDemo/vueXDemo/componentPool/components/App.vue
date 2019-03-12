<template>
    <div id="app">
        <h1>ComponentPool-VueX-Demo</h1>
        <compo-b :count="count"></compo-b>
        <compo-a :list="list" @add-number="addNumber($event)"></compo-a>
    </div>
</template>


<script>
import CompoA from './CompoA.vue';
import CompoB from './CompoB.vue';

export default {
    data:function(){
        return {
            list:[
                {id:1,number:1},
                {id:2,number:2},
                {id:3,number:3},
                {id:4,number:4}
            ],
            count:0
        }
    },
    components:{
        CompoA,CompoB
    },
    methods:{
        addNumber:function(event){
            this.count += event;
        }
    }
}
</script>
