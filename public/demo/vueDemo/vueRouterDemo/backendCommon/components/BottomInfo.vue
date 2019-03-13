<template>
    <div class="m-bottom">
        <div>bottom info</div>
        <div>{{info}}</div>
    </div>
    
</template>

<script>
export default {
    props:{
        info:{
            default:'this is default prop info value'
        }
    }
}
</script>

<style>
.m-bottom{
    margin-top:100px;
}
</style>
