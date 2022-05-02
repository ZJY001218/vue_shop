<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-button type="primary" plain @click="isAddShow">添加角色</el-button>
                </el-col>
            </el-row>

            
  <el-table :data="roles" border style="width: 100%">
      <el-table-column  width="60" type="expand">
        <template slot-scope="scope">
          <div class="box">
          <div v-if="scope.row.children.length>0">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <el-col :span="2">
                <el-tag closable @close="delTag(scope.row,scope.row.id,item1.id)">{{item1.authName}}</el-tag>
              </el-col>
              <el-col :span="22">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="2">
                    <el-tag closable type='warning' @close="delTag(scope.row,scope.row.id,item2.id)">{{item2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="22">
                    <el-tag @close="delTag(scope.row,scope.row.id,item3.id)" closable type='danger' v-for="item3 in item2.children" :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div v-else>此角色暂无数据</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="isEditShow(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="delRloes(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" plain icon="el-icon-setting" @click="isSetShow(scope.row)">权限</el-button>
            </div>
          </template> 
      </el-table-column>
  </el-table>
        </el-card>


        <!-- 添加角色 -->
        <el-dialog title="添加角色" :visible.sync="addShow">
  <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesRef">
    <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
      <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
      <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addShow = false">取 消</el-button>
    <el-button type="primary" plain @click="addRolesOk">确 定</el-button>
  </div>
</el-dialog>


        <!-- 修改角色 -->
        <el-dialog title="修改角色" :visible.sync="editShow">
  <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesRef">
    <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
      <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
      <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addShow = false">取 消</el-button>
    <el-button type="primary" plain @click="editRolesOk">确 定</el-button>
  </div>
</el-dialog>

<!-- 权限 -->
<el-dialog
  title="提示"
  :visible.sync="setShow"
  width="30%"
  :before-close="handleClose">
  <!-- 树形列表 -->   
  <el-tree
  ref="rightTreeRef"
  :data="treeData"    
  show-checkbox
  node-key="id"
  default-expand-all
  :default-checked-keys="checkedAll"
  :props="defaultProps">
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setShow = false">取 消</el-button>
    <el-button type="primary" @click="setRolesOk">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
import {
  getRloesListApi,
  addRolesListApi,
  editRolesListApi,
  delRolesListApi
} from "@/http/api";
export default {
  data() {
    return {
      roles: [], // 总角色数据

      // 添加
      formLabelWidth: "80px",
      addShow: false,
      addRolesForm: {}, // 添加角色的数据对象
      addRolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "change" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {min: 5,max: 10,message: "长度在 5 到 10 个字符",trigger: "change"
          }
        ]
      },

      // 修改
      editShow: false,

      // 权限
      setShow: false,
      treeData: [],
      defaultProps: {    // tree默认配置
        label: "authName",
        children: "children"
      },
      checkedAll:[],   // 默认选中id组成的数组
      rid:0,   // 当前用户id
    };
  },
  created() {
    this.getRolesList();
  },
  mounted() {},
  methods: {
    //获取角色列表方法
    async getRolesList() {
      // 调用后台接口
      let res = await getRloesListApi();
      console.log("角色res:", res);
      this.roles = res;
    },

    // 添加
    isAddShow() {
      this.addShow = true;
    },
    addRolesOk() {
      // 检查表单验证是否正确
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return false;
        await addRolesListApi(this.addRolesForm);
      });
      // 添加用户接口到后台,将数据接口交给后台
      // 隐藏对话框
      this.addShow = false;
       // 更新用户列表数据
      this.getRolesList();
      // 表单清空
      this.addRolesForm = {};
    },

    // 修改
    isEditShow(row) {
      this.editShow = true;
      this.addRolesForm = row;
    },
    editRolesOk() {
      // 检查表单校验
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return false;
        // 开始调用后台接口更新,更新数据
        const { id, roleName, roleDesc } = this.addRolesForm;
        console.log(id);
        await editRolesListApi(id, { roleName, roleDesc });
        // 隐藏对话框
        this.editShow = false;
        // 列表渲染
        this.getRolesList();
        // 表单清空
        this.addRolesForm = {};
      });
    },

    // 删除
    delRloes(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await delRolesListApi(id);
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 权限
    // 监听关闭
    handleClose() {
      this.checkedAll=[]
      this.setShow=false
    },
    async isSetShow(row) {
      const res = await this.$api.getRightsListApi("tree");
      console.log("权限:", res);
      this.treeData = res;
      this.rid=row.id
      // 递归获取当前角色所拥有的权限数组方法
      this.getCheckedIdAll(row,this.checkedAll)
      console.log("当前角色所有权限",this.checkedAll)
      this.setShow = true;
    },
    getCheckedIdAll(row,checkedAll){
      if(!row.children){
        return checkedAll.push(row.id)
      }
      row.children.forEach(item=>{
        this.getCheckedIdAll(item,checkedAll)
      })
    },
    // 点击确定拿到全选和半选的值,最后更新到后台
    async setRolesOk(){
      // 全选id的数组
      const allchecked=this.$refs.rightTreeRef.getCheckedKeys()
      // 半选id的数组
      const halfchecked=this.$refs.rightTreeRef.getHalfCheckedKeys()
      // 合并全选和半选的数组
      const arr=[...allchecked,...halfchecked]
      // 将合并的数组转换成字符串
      const arrStr=arr.join(',')
      // 调用角色授权接口
      const res=await this.$api.setRightApi(this.rid,arrStr)
      console.log("更新",res)
      this.getRolesList()
      this.setShow=false
    },
    // 删除标签
    async delTag(row,roleid,rightid){
      // 调用删除的接口
      const res=await this.$api.delTagApi(roleid,rightid)
      console.log("删除:",res)
      row.children=res
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
.box{padding: 10px;box-sizing: border-box}
.el-tag{margin: 5px}
</style>
