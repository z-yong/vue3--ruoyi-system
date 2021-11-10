<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg-icon icon-class="hamburger" class="hamburger" :class="{'is-active': isActive}" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const isActive = ref(props.isActive)
    const toggleClick = () => {
      ctx.emit('toggleClick')
    }
    return { isActive, toggleClick }
  }
})
</script>

<style scoped>
.hamburger.svg-icon {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger:hover {
  color: var(--theme);
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
