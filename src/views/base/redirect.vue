<!--
 * @Description: 重定向
 * @Version: 1.0
 * @Autor: yong.zhu
 * @Date: 2021-09-27 16:25:50
 * @LastEditors: yong.zhu
 * @LastEditTime: 2021-10-08 17:49:18
-->
<script lang='ts'>
import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'redirect',
  setup() {
    const { params, query } = useRoute()
    const { path } = params
    useRouter().replace({ path: '/' + path, query })
  },
  render() {
    return h('div')
  },
})
</script>
