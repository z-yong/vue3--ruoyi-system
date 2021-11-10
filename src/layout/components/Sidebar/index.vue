<template>
  <div :class="[ showLogo ? 'has-logo' : '', settings.sideTheme]">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="String(activeMenu)" :collapse="isCollapse" mode="vertical"
        :class="[isCollapse ? 'el-menu-collapse' : '',settings.sideTheme]" ref="elMenu"
        :background-color="variables['menu' + settings.sideTheme + 'Bg']"
        :text-color="variables['menu' + settings.sideTheme + 'Text']" unique-opened
        :active-text-color="settings.theme" :collapse-transition="false">
        <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index"
          :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <!-- 拖拽点 -->
    <div v-show="!isCollapse && settings.menuDrag" id="split-panel"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/assets/styles/variables.scss'
import settingsStore from '@/store/settings'
import permissionStore from '@/store/permission'
import appStore from '@/store/app'
import { useRoute } from 'vue-router'
import { computed } from '@vue/reactivity'

export default defineComponent({
  components: { SidebarItem, Logo },
  setup() {
    const settings = computed(() => settingsStore.getState())

    const sidebarRouters = computed(
      () => permissionStore.getState().sidebarRouters
    )

    const sidebar = computed(() => appStore.getState().sidebar)

    const route = useRoute()
    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    const showLogo = computed(() => settingsStore.getState().sidebarLogo)

    const isCollapse = computed(() => !sidebar.value.opened)

    return {
      settings,
      sidebarRouters,
      sidebar,
      activeMenu,
      showLogo,
      isCollapse,
      variables,
    }
  },
})
</script>

<style scoped>
#split-panel {
  cursor: col-resize;
  height: 100%;
  width: 5px;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
