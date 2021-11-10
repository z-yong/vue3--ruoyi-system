<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  setup() {
    // 防止第一次按enter键刷新网页
    document.onkeydown = (e) => {
      if (e && e.keyCode === 13) {
        // 如果提供了事件对象，则这是一个非IE浏览器
        if (e.preventDefault) {
          e.preventDefault()
        } else if (window.event) {
          // IE中阻止函数器默认动作的方式
          window.event.returnValue = false
        }
      }
    }
  }
})
</script>
