<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container"
    @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script lang='ts'>
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from 'vue'

export default defineComponent({
  props: {
    scrollLeft: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    let scrollbarWrap
    nextTick(() => {
      scrollbarWrap = document.getElementsByClassName('el-scrollbar__wrap')[1]
    })
    watch(
      () => props.scrollLeft,
      (val) => {
        if (scrollbarWrap) {
          scrollbarWrap.scrollLeft = val
        }
      }
    )

    const handleScroll = (e) => {
      if (!scrollbarWrap) return
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      scrollbarWrap.scrollLeft = scrollbarWrap.scrollLeft + eventDelta / 4
    }
    const emitScroll = () => {
      emit('scroll')
    }

    onMounted(() => {
      if (!scrollbarWrap) return
      scrollbarWrap.addEventListener('scroll', emitScroll, true)
    })

    onBeforeUnmount(() => {
      if (!scrollbarWrap) return
      scrollbarWrap.removeEventListener('scroll', emitScroll)
    })

    return { handleScroll }
  },
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
