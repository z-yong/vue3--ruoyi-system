<template>
  <div class="drawer-container">
    <div>
      <div class="setting-drawer-content">
        <div class="setting-drawer-title">
          <h3 class="drawer-title">主题风格设置</h3>
        </div>
        <div class="setting-drawer-block-checbox">
          <div v-for="(item, index) in checboxList" class="setting-drawer-block-checbox-item"
            @click="handleTheme(item.name)" :key="index">
            <img :src="item.imageL" :alt="item.alt" />
            <div v-if="sideTheme === item.name" class="setting-drawer-block-checbox-selectIcon"
              style="display: block">
              <i aria-label="图标: check" class="anticon anticon-check">
                <svg viewBox="64 64 896 896" data-icon="check" width="1em" height="1em"
                  :fill="theme" aria-hidden="true" focusable="false" class="">
                  <path
                    d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
                </svg>
              </i>
            </div>
          </div>
        </div>
        <div class="drawer-item">
          <span>主题颜色</span>
          <theme-picker style="float: right; height: 26px; margin: -3px 8px 0 0"
            @change="themeChange" />
        </div>
      </div>

      <el-divider />

      <h3 class="drawer-title">系统布局配置</h3>

      <div class="drawer-item">
        <span>开启 标签页</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>支持菜单栏横向拖拽</span>
        <el-switch v-model="menuDrag" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { computed } from '@vue/reactivity'
import settingsStore from '@/store/settings'
import ThemePicker from '@/components/ThemePicker/index.vue'
import checboxList from './checkBoxList.js'

export default defineComponent({
  components: { ThemePicker },
  setup() {
    const theme = computed(() => settingsStore.getState().theme)
    const sideTheme = computed(() => settingsStore.getState().sideTheme)

    const fixedHeader = computed({
      get() {
        return settingsStore.getState().fixedHeader
      },
      set(val) {
        settingsStore.changeSetting('fixedHeader', val as boolean)
      },
    })

    const tagsView = computed({
      get() {
        return settingsStore.getState().tagsView
      },
      set(val) {
        settingsStore.changeSetting('tagsView', val as boolean)
      },
    })

    const sidebarLogo = computed({
      get() {
        return settingsStore.getState().sidebarLogo
      },
      set(val) {
        settingsStore.changeSetting('sidebarLogo', val as boolean)
      },
    })

    const menuDrag = computed({
      get() {
        return settingsStore.getState().menuDrag
      },
      set(val) {
        settingsStore.changeSetting('menuDrag', val as boolean)
      },
    })

    const themeChange = (val) => {
      settingsStore.changeSetting('theme', val)
    }
    const handleTheme = (val) => {
      settingsStore.changeSetting('sideTheme', val)
    }

    return {
      checboxList,
      theme,
      sideTheme,
      fixedHeader,
      tagsView,
      sidebarLogo,
      menuDrag,
      themeChange,
      handleTheme,
    }
  },
})
</script>

<style lang="scss" scoped>
.setting-drawer-content {
  .setting-drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
    font-weight: bold;
  }

  .setting-drawer-block-checbox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    .setting-drawer-block-checbox-item {
      position: relative;
      margin-right: 22px;
      border-radius: 2px;
      cursor: pointer;

      img {
        width: 48px;
        height: 48px;
      }

      .setting-drawer-block-checbox-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        padding-top: 15px;
        padding-left: 24px;
        color: #1890ff;
        font-weight: 700;
        font-size: 14px;
      }
    }
  }
}

.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
