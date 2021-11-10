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
        // <template><svg-icon iconClass={icon}/></template>
        vnodes.push(createVNode('svg-icon', { 'icon-class': icon }))
      }

      if (title) {
        // <span slot='title'>{(title)}</span>
        vnodes.push(createVNode('span', { slot: 'title' }, title))
      }
      return vnodes
    }
  },
}
</script>
