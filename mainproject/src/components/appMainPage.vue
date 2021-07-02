<template>
    <el-container>
        <el-header >
            <el-menu class="menu" :default-active="activeIndex" mode="horizontal" background-color="#203f47"
            text-color="#f5fab1" active-text-color="#d3fab1">
                    <el-menu-item index="1" class="menu-class-noleftmargin" @click="activeIndex='1'">计划</el-menu-item>
                    <el-menu-item index="2" class="menu-class-noleftmargin" @click="activeIndex='2'">录像</el-menu-item>
                    <el-menu-item index="3" class="menu-class-noleftmargin" @click="activeIndex='3'">统计</el-menu-item>
            </el-menu>
        </el-header>
        <el-main><commonPage v-show="activeIndex==1"></commonPage></el-main>
    </el-container>
</template>

<script>
import commonPage from "./commonPage.vue";
export default {
    name:"MainPage",
    components:{commonPage},
    data(){
        return {  
            activeIndex:'1'
        }
    },
    methods:{

    },
    watch:{
        activeIndex(){
        }

    }

}
</script>

<style scoped>
    .menu{
        margin-left:auto;
        margin-right:auto;
        margin-bottom:10px;
        display:flex;
        justify-content: space-evenly;
        width:100%
    }
    
    .menu-class-noleftmargin{
        display:inline-block;
        flex-basis:10%;
        text-align: center;
    }
</style>