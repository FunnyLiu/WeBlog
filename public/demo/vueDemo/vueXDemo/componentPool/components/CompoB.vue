<template>
    <div>
        <div>总数据{{count}}</div>
        <div>总数据Vuex版{{countX}}</div>
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    props:{
        count:Number
    },
    computed:mapState({
        countX:state=> state.number.count
    })
}
</script>
