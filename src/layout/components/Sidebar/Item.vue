<!--
 * @Autor: yong.zhu
 * @Date: 2021-11-10 16:45:42
 * @LastEditors: yong.zhu
 * @LastEditTime: 2021-11-26 16:02:16
 * @Description: 
 * @Version: 1.0
-->
<script lang='ts'>
import { createVNode, VNode } from 'vue'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () => {
      const { icon, title } = props
      const vnodes: VNode[] = []

      if (icon) {
        vnodes.push(createVNode('svg-icon', { 'icon-class': icon }))
      }

      if (title) {
        vnodes.push(createVNode('span', { slot: 'title' }, title))
      }
      return vnodes
    }
  },
}
</script>
