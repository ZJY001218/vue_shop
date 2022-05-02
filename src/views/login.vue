<template>
  <div class="login">
    <h2>管理后台登录页面</h2>
    <el-form :model="user" :rules="rules" ref="login">
      <el-form-item prop="username">
        <el-input
          placeholder="输入用户名"
          prefix-icon="el-icon-user-solid"
          v-model="user.username"
        ></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          placeholder="输入密码"
          prefix-icon="el-icon-lock"
          type="password"
          v-model="user.password"
        ></el-input>
      </el-form-item>

      <el-form-item>
          <el-button class="login-btn" >重置</el-button>
        <el-button type="primary" plain class="login-btn" @click="dologin">登录</el-button>
        
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { LoginApi } from "@/http/api";
export default {
  name: "Vue",
  data() {
    return {
      // 表单绑定的数据
      user: {
        username: "",
        password: ""
      },

      // 表单校验的规则
      rules: {
        // 校验用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 8, message: "长度在 4 到8个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 8, message: "长度在 4 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    // 执行登录校验
    dologin() {
      console.log("login");
      this.$refs.login.validate(async valid => {
        if (!valid) return false;
        // 开始调用后台接口
        const res = await LoginApi(this.user);
        console.log('是否登录成功:',res)
        this.$router.push("/home")
      });
    }
  }
};
</script>

<style scoped >
.login {
  width: 30%;
  min-width: 400px;
  height: 250px;
  border: #ddd 1px solid;
  padding: 10px;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 200px auto;
  box-shadow: 2px 5px 10px #999;
}
.login-btn {
  float: right;
  width: 20%;
  margin-left: 10px;
}
</style>
