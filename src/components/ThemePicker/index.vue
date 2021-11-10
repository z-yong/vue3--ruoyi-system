<template>
  <el-color-picker v-model="theme" :predefine="[
      '#409EFF',
      '#1890ff',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d',
    ]" class="theme-picker" popper-class="theme-picker-dropdown" />
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import settingsStore from '@/store/settings'
import updateTheme from '@/utils/theme'
import { computed } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
export default defineComponent({
  setup(props, ctx) {
    const theme = computed(() => settingsStore.getState().theme)

    watch(
      () => theme.value,
      (val) => {
        updateTheme(val, ctx.emit('change', val) as string | undefined)
      },
      { immediate: true }
    )

    return { theme }
  },
})
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
