<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--  -->
        <el-card class="mt">
            <!-- 警示消息 -->
            <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>

            <!-- 进度条 -->
  <el-steps :active="active*1" align-center class="mt2">
  <el-step title="基本信息" description=""></el-step>
  <el-step title="商品参数" description=""></el-step>
  <el-step title="商品属性" description=""></el-step>
  <el-step title="商品图片" description=""></el-step>
  <el-step title="商品内容" description=""></el-step>
  <el-step title="完成" description=""></el-step>
</el-steps>

<!-- tab -->
<el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="goodsRef">
<el-tabs tab-position="left" :before-leave="beforeLave" v-model="active" @tab-click="handleClick" class="mt2">

    <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
            <!-- v-model当前选中项数组  options级联选择器数据源 props级联框默认配置项  change级联分类改变时触发-->
            <el-cascader
    v-model="rid"
    :options="cateData"
    :props="defaultProps"
    @change="handleChange"></el-cascader>
        </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="商品参数" name="1">
        <el-form-item :label="item1.attr_name" v-for="item1 in manyParams" :key="item1.id">
            <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox :label="item2" v-for="(item2,index) in item1.attr_vals" :key="index"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.id" >
            <el-input v-model="item.attr_vals">{{item.attr_vals}}</el-input>
        </el-form-item>
    </el-tab-pane>

    <!-- 图片上传 -->
    <el-tab-pane label="商品图片" name="3">
        <!-- headers脱离了ajax,要手动配置请求头 -->
        <el-upload
  action="http://www.ysqorz.top:8888/api/private/v1/upload"
  :headers="headers"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <!-- 富文本 -->
        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
        <!-- 添加按钮 -->
        <el-button type="primary" plain class="mt" @click="addGoodsOk">添加按钮</el-button>
    </el-tab-pane>
  </el-tabs>
  </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      active: "0",
      // 表单数据
      addGoodsForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [], // 商品参数
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "change"
          }
        ],
        goods_number: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ]
      },
      rid: [], // 当前选中的数组分类级别
      defaultProps: {
        expandTrigger: "hover",
        label: "cat_name",
        children: "children",
        value: "cat_id"
      }, // 级联默认配置
      cateData: [], // 级联框数据源
      manyParams: [], // 动态数据
      onlyParams: [], // 静态数据
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCateList();
  },
  mounted() {},
  methods: {
    // 渲染商品分类
    async getGoodsCateList() {
      const res = await this.$api.getGoodsCateListApi();
      console.log("商品分类", res);
      this.cateData = res;
    },
    // 点击菜单获得索引
    async handleClick() {
      console.log(this.active);
      console.log("切换", this.active);
      if (this.active === "1") {
        // 调取动态参数接口
        const res = await this.$api.getGoodsParamsApi(this.ridEnd);
        res.forEach(item => {
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(",") : [];
        });
        console.log("动态：", res);
        this.manyParams = res;
      } else if (this.active === "2") {
        // 调取静态参数
        this.onlyParams = await this.$api.getGoodsParamsApi(
          this.ridEnd,
          "only"
        );
        console.log("静态：", this.onlyParams);
      }
    },
    handleChange() {},
    //切换前判断是不是非空
    beforeLave(newActive, oldActive) {
      if (oldActive === "0" && this.rid.length !== 3) {
        this.$message({
          type: "error",
          message: "请选择三级分类"
        });
        return false;
      }
    },
    // 上传成功
    handleSuccess(res) {
      console.log("上传成功", res);
      this.addGoodsForm.pics.push({
        pic: res.data.tmp_path
      });
      console.log("pics:", this.addGoodsForm.pics);
    },
    // 删除上传
    handleRemove(res) {
      console.log("删除上传", res);
      const index = this.addGoodsForm.pics.findIndex(item => {
        return item.pic === res.response.data.tmp_path;
      });
      this.addGoodsForm.pics.splice(index, 1);
    },
    // 触发预览效果
    handlePreview() {},
    // 添加商品
    async addGoodsOk() {
      console.log("添加", this.addGoodsForm);
      // 处理分类数组为字符串
      this.addGoodsForm.goods_cat = this.rid.join(",");
      // 动态参数
      const dtData = this.manyParams.map(item => {
          console.log(item);
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')   // 要字符串
        };
      });
      // 静态参数
      const jtData = this.onlyParams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals   // 要字符串
        };
      });
      // 合并静态动态参数
      const mergeParams=[...dtData,...jtData]
      // 将合并的结果赋值给attr
      this.addGoodsForm.attrs=mergeParams

      console.log("动态参数:", this.manyParams);
      console.log("静态参数:", this.onlyParams);
      console.log("处理后动态参数:", dtData);
      console.log("处理后静态参数:", jtData);
      console.log("合并参数:", mergeParams);
      console.log("最终结果:", this.addGoodsForm);
      // 调用添加商品提交接口
      const res= await this.$api.addGoodsApi(this.addGoodsForm)
      console.log('添加成功:',res);
      // 添加成功后跳转到商品列表
      this.$router.push('/goods')
    }
  },
  computed: {
    ridEnd() {
      return this.rid[this.rid.length - 1];
    }
  }
};
</script>
<style scoped >
::v-deep .ql-editor {
  min-height: 460px;
}
</style>
