<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="2">Logo</el-col>
          <el-col :span="20">企业后台管理系统</el-col>
          <el-col :span="2">
            <el-button type="info" @click="loginOut">退出</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <!-- 左侧 -->
        <el-aside :width="isCollapse ? '65px':'200px'" >
          <div class="sp" @click="isCollapse=!isCollapse">|||</div>
          <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="true"
      :router="true"
      :collapse="isCollapse"
      :collapse-transition='false'
      >
      <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="ite.path" v-for="ite in item.children" :key="ite.id">
        <i class="el-icon-menu"></i>
        <span slot="title">{{ite.authName}}</span>
      </el-menu-item>
      </el-submenu>
    </el-menu>
        </el-aside>
        <!-- 右侧 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenusApi } from '@/http/api'
export default {
  name: "home",
  data(){
    return{
      menus:[],
      isCollapse:false
    }
  },
  created(){
    this.getMenus()
  },
  methods:{
    // 退出
    loginOut(){
      // 清楚本地token
      sessionStorage.removeItem('token')
      // 跳转到路由
      this.$router.replace('/login')
    },
    async getMenus(){
      const res=await getMenusApi()
      console.log('res:',res)
      this.menus=res
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #373d41;
  color: #fff;
  font-size: 22px;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-container {
  min-height: 800px;
  max-height: 800px;
}
.el-menu{border: none}
.sp{
 background-color: #4a5064;
 color: #fff;
 font-size: 12px;
 text-align: center;
 line-height: 22px;
 cursor: pointer;
 letter-spacing: .12em;}
</style>