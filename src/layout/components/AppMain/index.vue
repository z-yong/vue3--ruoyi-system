<template>
  <section class="app-main" :class="sideTheme">
    <Suspense>
      <template #default>
        <!-- 如果在route-view中加上 :route="route" 那么setup函数只会触发一次 -->
        <router-view class="app-container" v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive exclude="redirect" :max="10">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </template>
      <template #fallback> Loading... </template>
    </Suspense>
  </section>
</template>

<script lang='ts'>
import { defineComponent, watch } from 'vue'
import settingsStore from '@/store/settings'
import { computed } from '@vue/reactivity'

export default defineComponent({
  setup() {
    const sideTheme = computed(() => settingsStore.getState().sideTheme)

    return { sideTheme }
  },
})
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - 0px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    height: calc(100vh - 0px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 0px;
  }
}
</style>
