<template>
  <div class="navbar-wrapper" :style="{ '--theme': theme }">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <i class="el-icon-refresh right-menu-item" :class="refreshing ? 'active' : ''"
          @click="refreshPage"></i>
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <organizationStructure id="OrganizationStructure" class="right-menu-item" />
        <div class="message-box" :style="{
            color: messageDataNum > 0 ? '#5a5e66' : 'rgb(24, 144, 255)',
          }" @click="handleGoUnreadMessage">
          <el-badge :value="messageDataNum" :max="99" :hidden="messageDataNum > 0 ? false : true"
            class="item-icon">
            <i class="el-icon-message-solid"></i>
          </el-badge>
        </div>
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper df aic">
          <img :src="avatar" class="user-avatar" />
          <span>{{ sUserName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showSettings = true">
              <span>布局设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="ShowEditLayer">
              <span>密码修改</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <template v-dialogDrag:editPassword>
      <el-dialog title="密码修改" v-model="editPassword" custom-class="editPassword"
        :before-close="resetForm" append-to-body>
        <el-form :model="form" :rules="rules" ref="passwordform" label-width="150px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复新密码" prop="sPassword">
            <el-input type="password" v-model="form.sPassword" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <el-button size="small" @click="resetForm">取 消</el-button>
          <el-button size="small" type="primary" @click="passwordChangeOk">确 定</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script lang='ts'>
import { defineComponent, nextTick, ref } from 'vue'
import userStore from '@/store/user'
import tagsViewStore from '@/store/tagsView'
import settingsStore from '@/store/settings'
import appStore from '@/store/app'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import Search from '@/components/HeaderSearch/index.vue'
import OrganizationStructure from '@/components/OrganizationStructure/index.vue'
import { computed, reactive } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { verification, modify } from '@/api/store/login'
import Message from '@/utils/message'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    OrganizationStructure,
  },
  setup() {
    const editPassword = ref(false)
    const form = reactive({
      sUserId: userStore.getState().sUserId,
      oldPassword: '',
      newPassword: '',
      sPassword: '',
    })
    const rules = {
      oldPassword: {
        required: true,
        message: '请输入原始密码',
        trigger: 'blur',
      },
      newPassword: [
        {
          required: true,
          message: '请输入新密码',
          trigger: 'blur',
        },
      ],
      sPassword: [
        {
          required: true,
          message: '请再次输入新密码',
          trigger: 'blur',
        },
        {
          validator: (rule, value, callback) => {
            if (value !== form.newPassword) {
              return callback(new Error('两次密码输入必须一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
        },
      ],
    }

    const avatar = computed(() => userStore.getState().avatar)
    const sUserName = computed(() => userStore.getState().sUserName)
    const messageDataNum = computed(() => userStore.getState().messageDataNum)
    const sidebar = computed(() => appStore.getState().sidebar)
    const device = computed(() => appStore.getState().device)

    const theme = computed(() => settingsStore.getState().theme)
    const showSettings = computed({
      get() {
        return settingsStore.getState().showSettings
      },
      set(val) {
        settingsStore.changeSetting('showSettings', val as boolean)
      },
    })

    // 刷新页面
    const refreshing = ref(false)
    const route = useRoute()
    const refreshPage = () => {
      if (!refreshing.value) {
        refreshing.value = true
        tagsViewStore.delCachedView(route).then(() => {
          nextTick(() => {
            router.replace({
              path: '/redirect' + route.fullPath,
            })
          })
        })
        setTimeout(() => (refreshing.value = false), 1800)
      }
    }

    // 定时请求未读消息
    const setIntervalFunc = async () => {
      const data = await userStore.getMessageData()
      if (data == null) return
      setTimeout(setIntervalFunc, 1000 * 60 * 10)
    }
    setIntervalFunc()

    const passwordform = ref()
    const resetForm = () => {
      passwordform.value.resetFields()
      editPassword.value = false
    }

    const router = useRouter()
    const handleGoUnreadMessage = () => {
      router.push('/messageCenter/messageProcessing/unreadMessage')
    }
    const passwordChangeOk = () => {
      passwordform.value.validate((valid) => {
        if (valid) {
          verification(form).then(() => {
            modify(form).then(() => {
              ;(Message as any).success('密码修改成功')
              setTimeout(() => {
                userStore.fedLogOut()
                location.reload()
              }, 1000)
            })
          })
        } else {
          return false
        }
      })
    }
    const ShowEditLayer = () => {
      editPassword.value = true
    }
    const toggleSideBar = () => {
      appStore.toggleSidebar()
    }
    const logout = async () => {
      ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        userStore.logout().then(() => {
          location.href =
            process.env.NODE_ENV === 'production'
              ? window.globalVar.indexPath
              : '/'
        })
      })
    }

    return {
      editPassword,
      form,
      rules,
      sidebar,
      avatar,
      sUserName,
      device,
      theme,
      showSettings,
      messageDataNum,
      passwordform,
      refreshing,
      refreshPage,
      resetForm,
      handleGoUnreadMessage,
      passwordChangeOk,
      ShowEditLayer,
      toggleSideBar,
      logout,
    }
  },
})
</script>

<style lang="scss">
.navbar-wrapper {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.el-icon-refresh {
        font-size: 20px;
        height: auto;
        font-weight: 800;
        cursor: pointer;
        &:hover {
          color: var(--theme);
        }
        &.active {
          animation: refresh 1.5s linear;
        }
      }

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      display: flex;
      align-items: center;
      margin-right: 10px;

      .avatar-wrapper {
        position: relative;
        &:hover {
          color: var(--theme);
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          // cursor: pointer;
          // position: absolute;
          right: -20px;
          // top: 25px;
          font-size: 12px;
        }
        .user-name {
          display: inline-block;
          height: 100%;
        }
      }
    }
  }
  .message-box {
    display: inline-block;
    height: 100%;
    padding: 0 8px;
    margin-right: 10px;
    font-size: 20px;
    vertical-align: text-bottom;
    cursor: pointer;
    .item-icon {
      display: inline-block;
      line-height: initial;
      .el-icon-message-solid {
        color: #444;
        &:hover {
          color: var(--theme);
        }
      }
    }
  }
}

@keyframes refresh {
  to {
    transform: rotate(0);
  }
  from {
    transform: rotate(-360deg);
  }
}
</style>
