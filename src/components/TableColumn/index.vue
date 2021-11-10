<template>
  <ElTableColumn v-if="$slots.default" v-bind="$attrs" :label="label" :min-width="newMinWidth">
    <template v-slot="scope">
      <slot v-bind="scope"></slot>
    </template>
  </ElTableColumn>
  <ElTableColumn v-else-if="$slots.header" v-bind="$attrs" :label="label" :min-width="newMinWidth">
    <template v-slot:header="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
  </ElTableColumn>
  <ElTableColumn v-else v-bind="$attrs" :label="label" :min-width="newMinWidth"></ElTableColumn>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { ElTableColumn } from 'element-plus'
import { watch } from '@vue/runtime-core'

export default defineComponent({
  components: { ElTableColumn },
  inheritAttrs: false,
  props: {
    label: String,
    minWidth: {
      type: String,
      default: '120',
    },
  },
  setup(props) {
    const newMinWidth = ref(props.minWidth)

    const columnArr = require('./columnArr.json')
    watch(
      () => props.label,
      (val) => {
        const data = columnArr.find((item) => item.name === val)
        if (data) {
          newMinWidth.value = data.minWidth
        }
      },
      { immediate: true }
    )

    return { label: props.label, newMinWidth }
  },
})
</script>