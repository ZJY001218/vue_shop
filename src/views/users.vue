<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索页面 -->
    <el-card class="top">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" @input="searchUser" clearable>
            <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" plain @click="isAddShow">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="users" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="date" label="状态">
          <template slot-scope="scope">
            <div>
              <el-switch @change="changeStatus(scope.row)" v-model="scope.row.mg_state  "></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="isEditShow(scope.row)"></el-button>
              <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
              <el-button size="mini" type="warning" plain icon="el-icon-setting" @click="isSetShow(scope.row)"></el-button>
            </div>
          </template> 
        </el-table-column>
      </el-table>


      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 6, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

   <!-- 添加的表单 -->
    <el-dialog title="添加用户" :visible.sync="addShow">
  <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserRef">
    <el-form-item label="用户" prop="username" :label-width="formLabelWidth">
      <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
      <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
      <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="mobile" :label-width="formLabelWidth">
      <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addShow = false">取 消</el-button>
    <el-button type="primary" @click="addUserOk">确 定</el-button>
  </div>
</el-dialog>


<!-- 修改的表单 -->
    <el-dialog title="修改用户" :visible.sync="editShow">
  <el-form :model="addUserForm" :rules="addUserFormRules" ref="editUserRef">
    <el-form-item label="用户" prop="username" :label-width="formLabelWidth">
      <el-input disabled v-model="addUserForm.username" autocomplete="off" ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
      <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="mobile" :label-width="formLabelWidth">
      <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editShow = false">取 消</el-button>
    <el-button type="primary" @click="editUserOk">确 定</el-button>
  </div>
</el-dialog>

<!-- 设置角色权限 -->
<el-dialog title="设置角色" :visible.sync="setUserShow">
  <el-form :model="setUser">
    当前用户: <span>{{setUserList.username}}</span> <br><br>
    当前用户: <span>{{setUserList.role_name}}</span> <br><br>
    <el-form-item label="分配新角色">
      <el-select v-model="setUser.rid" placeholder="请选择活动区域">
        <el-option :label="item.roleName" :value="item.id" v-for="item in rolesList" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="setUserShow = false">取 消</el-button>
    <el-button type="primary" @click="setUserOk">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
import _ from "lodash";
import {getUserListApi,addUserApi,editUserApi,} from "@/http/api";
export default {
  data() {
    // 邮箱验证
    const checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入合法邮箱"));
      }
      callback();
    };
    // 手机验证
    const checkMobile = (rule, value, callback) => {
      // 验证邮箱的正则
      const reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入合法手机"));
      }
      callback();
    };

    return {
      // 总用户列表数据
      users: [],

      //分页
      total: 0, // 总条数
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },

      //添加表单
      addShow: false, // 添加模态框
      formLabelWidth: "80px",
      addUserForm: {}, // 添加用户数据对象
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [
          { validator: checkEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ],
        mobile: [
          { validator: checkMobile, trigger: "blur" },
          { required: true, message: "请输入手机号", trigger: "blur" }
        ]
      },

      // 修改
      editShow: false,

      // 权限
      setUserShow:false,
      setUser:{rid:""},   // 绑定分配角色数据
      setUserList:{},   // 当前用户数据
      rolesList:{}    // 角色列表数据
    };
  },
  created() {
    // 调用
    this.getUserList();
  },
  mounted() {},
  methods: {
    // 搜索防抖
    searchUser: _.debounce(function() {
      this.getUserList();
    }, 300),

    // 分页
    handleSizeChange(val) {
      console.log("当前每页显示条数:", val);
      // 赋值
      this.queryInfo.pagesize = val;
      // 更新列表数据
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log("当前页码:", val);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    //获取用户列表方法
    async getUserList() {
      // 调用后台接口
      let res = await getUserListApi(this.queryInfo);
      console.log("用户res:", res);
      const { total, users } = res;
      this.users = users;
      this.total = total;
    },

    // 添加
    // 打开添加模态框
    isAddShow() {
      this.addShow = true;
    },
    // 确定将用户信息添加到后台
    addUserOk() {
      // 检查表单验证是否正确
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return false;
        const res = await addUserApi(this.addUserForm);
      });
      // 添加用户接口到后台,将数据接口交给后台
      // 隐藏对话框
      this.addShow = false;
      // 更新用户列表数据
      this.getUserList();
      // 表单清空
      this.addUserForm = {};
    },

    // 修改
    isEditShow(row) {
      this.editShow = true;
      this.addUserForm = row;
    },
    editUserOk() {
      // 检查表单校验
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) return false;
        // 开始调用后台接口更新,更新数据
        const { id, mobile, email } = this.addUserForm;
        await editUserApi(id, { mobile, email });
        // 隐藏对话框
        this.editShow = false;
        // 列表渲染
        this.getUserList();
      });
    },

    // 删除
    async delUser(id) {
      let isok;
      try {
        isok = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
      } catch (e) {
        isok = error;
      }
      if (isok === "confirm") {
        // 调用接口
        await this.$api.delUserApi(id)
        // 渲染页面
        this.getUserList()

      } else if (isok === "cancel") {
        this.$message({
          message: "已取消删除",
          type: "info"
        });
      }
    },

    // 修改状态
    async changeStatus(row) {
      const { id, mg_state: mgState } = row;
      await this.$api.changeUserApi(id, mgState); // 把api放到min.js中，用$api在引入
    },

    // 权限
    // 弹出框
    async isSetShow(user){
      console.log('user:',user)
      this.setUserShow=true
      this.setUserList = user
      const res=await this.$api.setUserApi()
      this.rolesList=res
    },
    // 确认修改
    async setUserOk(){
      const{id}=this.setUserList
      const{rid}=this.setUser
      await this.$api.setUsertoRloesApi(id,rid)
      // 隐藏对话框
      this.setUserShow=false
      // 表单清空
      this.setUser={}
      // 页面渲染
      this.getUserList()
    }
  }
};
</script>

<style scoped>
.top {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 10px;
}
</style>


