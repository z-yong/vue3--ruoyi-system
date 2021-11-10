<template>
  <el-tooltip class="item" effect="dark" :disabled="isShowTooltip" :content="content"
    :placement="placement">
    <div class="over-flow" :class="className" @mouseover="onMouseOver">
      <div class="content">
        <span :ref="refName" :id="refName">
          <svg-icon v-if="icon" :icon-class="icon" />
          <span>{{ content || "-" }}</span>
        </span>
      </div>
    </div>
  </el-tooltip>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    // 显示的文字内容
    content: {
      type: String,
      default: () => {
        return ''
      },
    },
    // 显示文字方向
    placement: {
      type: String,
      default: 'top',
    },
    // 外层框的样式，在传入的这个类名中设置文字显示的宽度
    className: {
      type: String,
      default: () => {
        return ''
      },
    },
    // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: {
      type: String,
      default: () => {
        return ''
      },
    },
    icon: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  setup(props) {
    const isShowTooltip = ref(true)
    const contentDom = document.getElementById(props.refName)
    const onMouseOver = () => {
      if (contentDom) {
        const parentWidth =
          contentDom.parentNode &&
          (contentDom.parentNode as HTMLElement).offsetWidth
        const contentWidth = contentDom.offsetWidth
        // 判断是否开启tooltip功能
        if (contentWidth > (parentWidth as number)) {
          isShowTooltip.value = false
        } else {
          isShowTooltip.value = true
        }
      }
    }
    return { isShowTooltip, onMouseOver }
  },
})
</script>

<style lang="scss" scoped>
.con_txt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
p {
  margin: 0;
}
</style>