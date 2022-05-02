<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="mt">
            <el-table :data="rights" border style="width: 100%">
                <el-table-column type="index" prop="date"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
            <el-tag v-show="scope.row.level==0">一级</el-tag>
            <el-tag type="success" v-show="scope.row.level==1">二级</el-tag>
            <el-tag type="info" v-show="scope.row.level==2">三级</el-tag>

          </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { getRightsListApi } from "@/http/api";
export default {
  data() {
    return {
      rights: [] // 所有数据
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    //获取权限列表方法
    async getRightsList() {
      // 调用后台接口
      let res = await getRightsListApi("list");
      console.log("权限res:", res);
      this.rights = res;
    }
  }
};
</script>

<style scoped >
</style>
