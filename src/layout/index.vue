<template>
  <div :class="classObj" class="app-wrapper"
    :style="{ '--current-color': theme, cursor: isDrag ? 'col-resize' : '' }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg"
      @click="handleClickOutside" />
    <sidebar class="sidebar-container" :style="{ width: barWidth }" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container"
      :style="{ 'margin-left': barWidth }">
      <div :class="{ 'fixed-header': fixedHeader }" :style="{ width: `calc(100% - ${barWidth}` }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel>
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import appStore from '@/store/app'
import settingsStore from '@/store/settings'
import userStore from '@/store/user'
import { isMobile, throttle } from '@/utils'
import Navbar from './components/Navbar/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import AppMain from './components/AppMain/index.vue'
import Settings from './components/Settings/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import TagsView from './components/TagsView/index.vue'
import variables from '@/assets/styles/variables.scss'
import { onBeforeRouteUpdate } from 'vue-router'
import { ElNotification } from 'element-plus'
import { onMounted, onBeforeUnmount } from '@vue/runtime-core'
import commonStore from '@/store/common'

export default defineComponent({
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
  },
  setup() {
    const isDrag = ref(false)

    const theme = computed(() => settingsStore.getState().theme)
    const needTagsView = computed(() => settingsStore.getState().tagsView)
    const fixedHeader = computed(() => settingsStore.getState().fixedHeader)
    const sidebar = computed(() => appStore.getState().sidebar)
    const device = computed(() => appStore.getState().device)

    const sideBarDefaultWidth = ref(settingsStore.getState().menuWidth)

    const barWidth = computed(() => {
      if (!sidebar.value.opened) {
        //关闭时，右侧内容主题left设置为默认的54
        return '54px !important'
      } else {
        return `${sideBarDefaultWidth.value}px !important`
      }
    })

    const classObj = computed(() => {
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile',
      }
    })

    const mobile = isMobile()

    onBeforeRouteUpdate(() => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        appStore.closeSideBar(false)
      }
    })

    const resizeHandler = () => {
      if (!document.hidden) {
        appStore.toggleDevice(mobile ? 'mobile' : 'desktop')
        if (mobile) {
          appStore.closeSideBar(true)
        }
      }
    }

    const handleClickOutside = () => {
      appStore.closeSideBar(false)
    }
    const moveSlideBar = () => {
      const splitPanel = document.getElementById('split-panel')
      if (!splitPanel) return
      splitPanel.onmousedown = (e) => {
        // splitPanel.style.background = '#409eff'
        let startX = e.clientX
        document.onmousemove = throttle((e) => {
          isDrag.value = true
          const endX = e.clientX
          const moveLen = startX - endX
          startX = endX
          // 设置拖动幅度
          sideBarDefaultWidth.value -= moveLen
          if (sideBarDefaultWidth.value < variables.sideBarWidthNumber) {
            sideBarDefaultWidth.value = variables.sideBarWidthNumber
          }
          if (sideBarDefaultWidth.value > variables.sideBarMaxWidthNumber) {
            sideBarDefaultWidth.value = variables.sideBarMaxWidthNumber
          }
        }, 50)
        document.onmouseup = () => {
          // 重置
          // splitPanel.style.background = "";
          document.onmousemove = null
          document.onmouseup = null
          isDrag.value = false
          settingsStore.changeSetting('menuWidth', sideBarDefaultWidth.value)
        }
        return false
      }
    }
    // 右下角消息提醒
    const actMessages = () => {
      userStore.getMessageData().then((data: any) => {
        if (!data || !data.length) return
        let str = ''
        data.map((itme, index) => {
          str =
            str +
            `<p>${index + 1}、您有 <strong>${
              itme.nStockNum
            }</strong> 条 <strong>${itme.sMsgTypeName}</strong> 信息未读。</p>`
        })
        ElNotification({
          type: 'warning',
          title: '未读消息提醒',
          dangerouslyUseHTMLString: true,
          position: 'bottom-right',
          offset: 20,
          message: str,
          duration: 6000,
          customClass: 'notification',
          onClick: () => {},
        })
      })
    }

    onMounted(() => {
      window.addEventListener('resize', resizeHandler)
      if (mobile) {
        appStore.toggleDevice('mobile')
        appStore.closeSideBar(true)
      }
      moveSlideBar()
      // actMessages()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    return {
      barWidth,
      classObj,
      theme,
      needTagsView,
      fixedHeader,
      sidebar,
      device,
      isDrag,
      handleClickOutside,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.main-container {
  display: flex;
  flex-direction: column;
}
</style>
