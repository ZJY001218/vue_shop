<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

         <!-- 搜索页面 -->
    <el-card class="mt">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" @input="searchUser" clearable>
            <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goods" border style="width: 100%" class="mt">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="70"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column label="创建时间" width="130">
          <template slot-scope="scope">
            <div>
              {{scope.row.add_time | dateTime}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作" width="180">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="isEditShow(scope.row)"></el-button>
              <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="delGoods(scope.row)"></el-button>
            </div>
          </template> 
        </el-table-column>
      </el-table>


      <!-- 分页 -->
      <el-pagination
      class="mt"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 6, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    
    </div>
</template>

<script>
import _ from "lodash";
import {getGoodsListApi } from "@/http/api";
export default {
  data() {
    return {
      goods: [], // 商品所有数据

      //分页
      total: 0, // 总条数
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
    };
  },
  created(){
      this.getGoodsList()
  },
  mounted() {},
  methods: {
      // 搜索防抖
    searchUser: _.debounce(function() {
      this.getGoodsList();
    }, 300),
    
      // 分页
    handleSizeChange(val) {
      console.log("当前每页显示条数:", val);
      // 赋值
      this.queryInfo.pagesize = val;
      // 更新列表数据
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      console.log("当前页码:", val);
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },

    //获取用户列表方法
    async getGoodsList() {
      // 调用后台接口
      let res = await getGoodsListApi(this.queryInfo);
      console.log("用户res:", res);
      const { total, goods } = res;
      this.goods = goods;
      this.total = total;
    },
     // 删除
    delGoods(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.$api.delGoodsApi(row.goods_id);
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 去添加商品页面
    addGoods(){
      this.$router.push('/goodsadd')
    }
  }
};
</script>

<style scoped >
</style>
