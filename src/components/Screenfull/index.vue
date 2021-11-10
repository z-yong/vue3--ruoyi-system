<template>
  <div>
    <svg-icon class="screenfull" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'"
      @click="click" />
  </div>
</template>

<script lang='ts'>
import Message from '@/utils/message'
import { onMounted, onBeforeUnmount } from '@vue/runtime-core'
import screenfull, { Screenfull } from 'screenfull'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const isFullscreen = ref(false)

    const click = () => {
      if (!screenfull.isEnabled) {
        Message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle()
    }
    const change = () => {
      isFullscreen.value = (screenfull as Screenfull).isFullscreen
    }
    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }
    const destroy = () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    }

    onMounted(init)
    onBeforeUnmount(destroy)

    return { isFullscreen, click }
  },
})
</script>


<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
.screenfull:hover {
  color: var(--theme);
}
</style>
