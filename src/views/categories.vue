<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 主题区 -->
        <el-card class="mt">
            <el-row>
                <el-col>
                    <el-button type="primary" plain @click="addShow">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table border class="mt" :data="goodsCateDara" row-key="cat_id">
                <el-table-column label="#" type="index">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.index}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="分类名称" prop="cat_name"></el-table-column>
                <el-table-column label="是否有效">
                    <template slot-scope="scope">
                        <div>
                            <i class="el-icon-success trur" v-if="!scope.row.cat_deleted"></i>
                            <i class="el-icon-error false" v-else></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <div>
                           <el-tag v-show="scope.row.cat_level==0">一级</el-tag>
                           <el-tag type="success" v-show="scope.row.cat_level==1">二级</el-tag>
                        <el-tag type="info" v-show="scope.row.cat_level==2">三级</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                        <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editShow(scope.row)"></el-button>
                        <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="delCate(scope.row)"></el-button>
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


        <!-- 添加弹框 -->
        <el-dialog title="添加分类" :visible.sync="isaddShow" lable-width="80px" @close="resetForm">
    <el-form :model="addCateForm" :rules="addCateFormRules" ref="CateRef">
        <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addCateForm.cat_name" autocomplete="off" ></el-input>
        </el-form-item>
    <el-form-item label="父级区域" >
      <!-- 级联选择器 -->
      <el-cascader
      ref="twoCateRef"
    v-model="checkCateAll"
    :options="twoCateData"
    :props="defaultProps"
    @change="handleChange"></el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="isaddShow">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </div>
</el-dialog>

<!-- 编辑 -->
        <el-dialog title="编辑分类" :visible.sync="iseditShow" lable-width="80px" @close="resetForm">
  <el-form :model="editCateForm" :rules="editCateFormRules" ref="EditRef">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="editCateForm.cat_name" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="iseditShow = false">取 消</el-button>
    <el-button type="primary" @click="editCateOK">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类数据
      goodsCateDara: [],
      //
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 添加
      isaddShow: false,
      addCateForm: {
        cat_name: "",
        cat_pid: "", // 父级id
        cat_level: ""
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ]
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ]
      },
      defaultProps: {
        checkStrictly: true, // 选择任一项
        expandTrigger: "hover",
        label: "cat_name",
        children: "children",
        value: "cat_id"
      },
      twoCateData: [],
      checkCateAll: [],

      // 编辑
      iseditShow: false,
      editCateForm: {
        cat_name: ""
      }
    };
  },
  created() {
    this.getGoodsCateList();
  },
  mounted() {},
  methods: {
    // 点击触发
    handleChange() {
      this.$refs.twoCateRef.dropDownVisible = false;
    },
    // 数据渲染
    async getGoodsCateList() {
      const res = await this.$api.getGoodsCateListApi(this.queryInfo);
      console.log(res);
      const { total, result } = res;
      console.log(result);
      result.forEach((item, index) => {
        item.index = index + 1;
      });
      this.goodsCateDara = result;
      this.total = total;
    },
    // 分页
    handleSizeChange(val) {
      console.log("当前每页显示条数:", val);
      // 赋值
      this.queryInfo.pagesize = val;
      // 更新列表数据
      this.getGoodsCateList();
    },
    handleCurrentChange(val) {
      console.log("当前页码:", val);
      this.queryInfo.pagenum = val;
      this.getGoodsCateList();
    },
    // 弹出框
    async addShow() {
      this.isaddShow = true;
      const res = await this.$api.getGoodsCateListApi({ type: 2 });
      console.log("二级分类", res);
      this.twoCateData = res;
    },
    // 确认添加
    addCate() {
      console.log(111);
      if (this.checkCateAll.length !== 0) {
        console.log(222);
        this.addCateForm.cat_pid = this.ridEnd;
        this.addCateForm.cat_level = this.checkCateAll.length;
      } else {
        console.log(222);
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
      // 检查表单校验
      this.$refs.CateRef.validate(async valid => {
       console.log(this.$refs.CateRef);
        if (!valid) return false;
         console.log(333);
        console.log("更新对象", this.addCateForm);
        // 调用接口
      const res = await this.$api.addGoodsCateApi(this.addCateForm);
      console.log("添加:", res);
      this.getGoodsCateList();
       this.isaddShow = false;
      });
    },

    // async addCate() {
    //   this.isaddShow = false;
    //   if (this.checkCateAll.length !== 0) {
    //     this.addCateForm.cat_pid = this.ridEnd;
    //     this.addCateForm.cat_level = this.checkCateAll.length;
    //   } else {
    //     this.addCateForm.cat_pid = 0;
    //     this.addCateForm.cat_level = 0;
    //   }
    //   // 调用接口
    //   const res = await this.$api.addGoodsCateApi(this.addCateForm);
    //   console.log("添加:", res);
    //   this.getGoodsCateList();
    // },
    
    // 重置表单
    resetForm() {
      this.addCateForm = {};
      this.checkCateAll = [];
    },
    // 编辑弹框
    editShow(row) {
      console.log("row", row);
      this.iseditShow = true;
      this.editCateForm.cat_name = row.cat_name;
      this.editCateForm.cat_id = row.cat_id;
    },
    // 确认修改
    editCateOK() {
      // 检查表单校验
      this.$refs.EditRef.validate(async valid => {
        if (!valid) return false;
        console.log("更新对象", this.editCateForm);
        const { cat_id: catId, cat_name: catName } = this.editCateForm;
        const res = await this.$api.editGoodsCateApi(catId, catName);
        this.iseditShow = false;
        this.getGoodsCateList();
      });
    },

    // 删除
    delCate(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log("111", row);
          await this.$api.delCateListApi(row.cat_id);
          this.getGoodsCateList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  computed: {
    ridEnd() {
      return this.checkCateAll[this.checkCateAll.length - 1];
    }
  }
};
</script>

<style>
.el-radio {
  width: 100%;
  height: 25px;
  position: absolute;
}
.el-radio__inner {
  display: none;
}
</style>


<style scoped >
.trur {
  color: paleturquoise;
}
.false {
  color: pink;
}
.el-input,
.el-cascader {
  width: 600px;
}
</style>
