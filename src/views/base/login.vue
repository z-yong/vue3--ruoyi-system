<template>
  <div class="login" :style="{ backgroundImage: 'url(' + logoBgUrl + ')' }">
    <div class="login-form">
      <div class="left-img">
        <img :src="loginLeftImgUrl" alt="" />
      </div>
      <div class="form-box">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <div class="right-box">
            <h3 class="title">
              <span>欢迎来到{{ cmsName }}</span>
            </h3>
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                <template #prefix>
                  <svg-icon icon-class="user" class="el-input__icon input-icon" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter="handleLogin">
                <template #prefix>
                  <svg-icon icon-class="password" class="el-input__icon input-icon" />
                </template>
              </el-input>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码 </el-checkbox>
            <el-form-item style="width: 100%">
              <el-button :loading="loading" type="primary" style="width: 100%; height: 40px" @click.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>{{ cmsName }}V{{ version }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import userStore from '@/store/user'
import { defineComponent, reactive, ref } from 'vue'
import { LocationQueryValue, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'login',
  setup() {
    const loginLeftImgUrl = window.globalVar.loginLeftImgUrl
    const logoBgUrl = window.globalVar.logoBgUrl
    const logoUrl = window.globalVar.logoUrl
    const cmsName = window.globalVar.cmsName
    const version = require('/package.json').version

    const loginForm = reactive({
      username: '',
      password: '',
      rememberMe: false
    })
    const loginRules = reactive({
      username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
      password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
    })

    // 获取cookie中记录用户信息
    const username = Cookies.get('username')
    const password = Cookies.get('password')
    const rememberMe = Cookies.get('rememberMe')
    loginForm.username = username ? username : loginForm.username
    loginForm.password = password ? decrypt(password) : loginForm.password
    loginForm.rememberMe = rememberMe ? Boolean(rememberMe) : false

    // 点击登录
    const loading = ref(false)
    const redirect: string | LocationQueryValue[] | null = useRoute().query.redirect
    const router = useRouter()
    const loginFormRef = ref()
    const handleLogin = () => {
      loginFormRef.value.validate((valid: any) => {
        if (valid) {
          loading.value = true
          if (loginForm.rememberMe) {
            Cookies.set('username', loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(loginForm.password), {
              expires: 30
            })
            Cookies.set('rememberMe', String(loginForm.rememberMe), {
              expires: 30
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          userStore
            .login({
              sUserCode: loginForm.username,
              sPassword: loginForm.password
            })
            .then(() => {
              router.push({ path: String(redirect) || '/' })
            })
            .finally(() => (loading.value = false))
        }
      })
    }

    return {
      loginLeftImgUrl,
      logoBgUrl,
      logoUrl,
      cmsName,
      version,
      loginForm,
      loginRules,
      loading,
      loginFormRef,
      handleLogin
    }
  }
})
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  overflow: hidden;
}
.login-form {
  display: flex;
  border-radius: 6px;
  background: #ffffff;
  width: 90%;
  height: 75%;
  box-shadow: 0px 0px 8px 10px rgba(188, 188, 188, 0.2);
  overflow: hidden;
  .left-img {
    width: 42vw;
    border-right: 1px solid #f0f0f0;
    box-sizing: border-box;
    padding: 30px 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .form-box {
    flex: 1;
    overflow: hidden;
    .right-box {
      padding: 30px 30px 20px 80px;
      .title {
        display: flex;
        color: #707070;
        overflow: hidden;
        white-space: nowrap;
        margin-bottom: 40px;
        span {
          font-size: 40px;
          margin-right: 10px;
        }
      }
      .el-input {
        .el-input__wrapper {
          width: 100%;
          height: 38px;
          max-width: 360px;
          input {
            outline: none;
            border: none;
          }
        }
      }
      .el-form-item {
        .el-button {
          width: 100%;
          max-width: 360px;
        }
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }
    }
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #a6a6a6;
  font-family: Arial;
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 400;
}
.login-code-img {
  height: 38px;
}
</style>
