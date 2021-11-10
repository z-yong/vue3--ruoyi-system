<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang='ts'>
import { isExternal } from '@/utils/validate'
import { computed, defineComponent } from 'vue'
import userStore from '@/store/user'
export default defineComponent({
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const external = computed(() => isExternal(props.to))
    const type = computed(() => {
      if (external.value) {
        return 'a'
      }
      return 'router-link'
    })
    const linkProps = (to) => {
      if (external.value) {
        let sUserCode = userStore.getState().sSelfCode
        let sDeptCode = 0
        return {
          href: to + '?sUserCode=' + sUserCode + '&sDeptCode=' + sDeptCode,
          target: '_blank',
          rel: 'noopener',
        }
      }
      return { to }
    }
    return { type, linkProps }
  },
})
</script>
