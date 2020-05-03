<script src="../../../../qiji/sale-client/src/renderer/main.js"></script>
<template>
  <!--外面控制登录框布局-->
  <div class="login-page"
       v-loading="updataLoading"
       :element-loading-text="showUpdateInfo"
       element-loading-spinner=""
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="layer flex-center">
      <!-- logo -->
      <div class="logo-group">
        <img src="../assets/logo.png" alt="logo">
        <p style="margin-top:10px;margin-left:36px;color:#111;font-weight:bold;">后台管理系统</p>
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm"
                   element-loading-text="加载中">
            <el-form-item prop="username">
              <el-input clearable type="text" v-model="ruleForm.username" autofocus @keyup.enter.native="login" auto-complete="off"
                        placeholder="账号">
                <i slot="prepend" class="fa fa-user-circle-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input clearable type="password" v-model="ruleForm.password" @keyup.enter.native="login" auto-complete="off"
                        placeholder="密码">
                <i slot="prepend" class="fa fa-keyboard-o"></i>
              </el-input>
            </el-form-item>
            <el-button :loading="$store.state.loading.isLoading" @click="login" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div> <!-- div.form-group -->
    </div> <!-- div.layer.flex-center -->
  </div> <!-- div.login-page -->
</template>
<script>
// import os from 'os'
// import { Message } from 'element-ui'
// import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      citys: [],
      updataLoading: false,
      showUpdateInfo: '',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      form: {
        region: ''
      },
      cityTitle: ''
    }
  },
  created () {
  },
  methods: {
    // 删除左右两端的空格
    trim (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    login () {
      this.$router.push('/home')
    }

  }
}
</script>
<style lang="scss">
  .logo-group{
    margin-bottom: 50px;
  }
  .city-selete-wrap-style {
    display: flex;

    .city-icon {
      font-size: 16px;
      height: 40px;
      background-color: #f5f7fa;
      color: #909399;
      border: 1px solid #dcdfe6;
      border-right-width: 0;
      border-radius: 4px 0 0 4px;
      padding: 0 16px;
    }

    .city-selete-style {
      .el-input__inner {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  // 登陆框
  .form-group {
    width: 370px;
    // 卡片阴影
    .el-card {
      border: none;
      box-shadow: none;

      @media (min-width: 371px) {
        box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
        border: 1px solid #ebeef5;
      }

      .el-card__body {
        //padding-top: 70px;
      }
    }

    // 登陆按钮
    .el-select,
    .button-login {
      width: 100%;
    }

    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
  }
</style>
<style lang="scss" scoped>
  @import '@/assets/css/pages/login/style.scss';
</style>
