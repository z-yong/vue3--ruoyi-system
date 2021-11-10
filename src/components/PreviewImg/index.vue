<template>
  <el-dialog v-dialogDrag title="图片预览" v-model="fileList.visible" width="45%"
    :before-close="handleClose">
    <el-carousel :interval="4000" height="540px">
      <el-carousel-item v-for="item in fileList.imgs" :key="item.url">
        <img :src="item.url" alt="" width="100%" height="540px">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { ref } from '@vue/reactivity'
export default defineComponent({
  props: ['fileList'],
  setup(props, ctx) {
    const visible = ref(true)
    const handleClose = () => {
      ctx.emit('close')
    }
    return {
      fileList: props.fileList,
      visible,
      handleClose,
    }
  },
})
</script>
