<template>
    <div>
        <button @click="addNumberToA(number)">
            将数量{{number}}增加到B
        </button>
    </div>
</template>

<script>


export default {
    props:{
        number:Number
    },
    methods:{
        addNumberToA:function(number){
            this.$emit('add-number',number)
        }
    }
}
</script>
