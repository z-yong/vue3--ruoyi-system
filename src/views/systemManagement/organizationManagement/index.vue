<template>
  <div>
    {{ type }}
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onActivated,
  onMounted,
  ref,
  watch,
} from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
export default defineComponent({
  name: 'organizationManagement',
  setup() {
    const type = ref('')
    console.log('setup')
    onMounted(() => {
      type.value = 'onMounted'
      console.log('onMounte')
    })
    onActivated(() => {
      type.value = 'onActivated'
      console.log('onActivated')
    })
    onBeforeRouteUpdate(() => {
      console.log('onBeforeRouteUpdate')
    })
    return { type }
  }
})
</script>
