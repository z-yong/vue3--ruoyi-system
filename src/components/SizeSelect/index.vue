<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item of sizeOptions" :key="item.value"
          :disabled="size===item.value" :command="item.value">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang='ts'>
import appStore from '@/store/app'
import tagsViewStore from '@/store/tagsView'
import Message from '@/utils/message'
import { computed } from '@vue/reactivity'
import { nextTick } from '@vue/runtime-core'
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const sizeOptions = [
      { label: 'Default', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' },
    ]

    const size = computed(() => appStore.getState().size)

    const handleSetSize = (size) => {
      // this.$ELEMENT.size = size
      appStore.setSize(size)
      refreshView()
      Message({
        message: 'Switch Size Success',
        type: 'success',
      })
    }

    const route = useRoute()
    const router = useRouter()
    const refreshView = () => {
      tagsViewStore.delAllCachedViews()

      const { fullPath } = route

      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath,
        })
      })
    }

    return { sizeOptions, size, handleSetSize }
  },
})
</script>