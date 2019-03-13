<template>
    <div class="m-nav">
        <ul>
            <li v-for="item in list" :key="item">
                <router-link :to="item">{{item}}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:['id'],
    computed:{
        list(){
            return [
                `/${this.id}/content/contenta`,
                `/${this.id}/content/contentb`
            ]
        }
    }
}
</script>

<style>
.m-nav {
    float:left;
    width:400px;
}
</style>
