<template>
    <div>
        <button @click="addNumberToA(number)">
            将数量{{number}}增加到B
        </button>
    </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    props:{
        number:Number
    },
    methods:{
        addNumberToA:function(number){
            //通过action
            //this.$store.dispatch('number/addNumberAction',number)
            //直接通过mutation
            this.$store.commit('number/addNumber',number)
        },
    },
}
</script>
