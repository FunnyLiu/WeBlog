<template>
    <div>
        <div>CompoA1 列表,通过事件的方式通信从A1->A->B</div>
        <ul>
            <li v-for="item in list" :key="item.id">
                <compo-a1 :number="item.number" @add-number="$emit('add-number',$event)"></compo-a1> 
            </li>
        </ul>
        <div>CompoA2 列表,通过Vuex dispatch的方式通信从A2->B</div>
        <ul>
            <li v-for="item in list" :key="item.id">
                <compo-a2 :number="item.number"></compo-a2> 
            </li>
        </ul>
    </div>
</template>


<script>
import CompoA1 from './CompoA1.vue';
import CompoA2 from './CompoA2.vue';

export default {
    props:{
        list:Array
    },
    components: {
        CompoA1,
        CompoA2
    }
}
</script>
