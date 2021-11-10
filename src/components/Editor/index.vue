<template>
  <div class="editor" ref="editor" :style="styles"></div>
</template>

<script lang='ts'>
import Quill from "quill"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
import { defineComponent, onMounted, computed, watch, ref, onBeforeUnmount } from 'vue'
export default defineComponent({
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: ""
    },
    /* 高度 */
    height: {
      type: Number,
      default: null
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null
    },
  },
  setup(props, ctx) {
    // 编辑器样式调整
    const styles = computed(() => {
      const style = { minHeight: '', height: ''}
      if (props.minHeight) {
        style.minHeight = `${props.minHeight}px`
      }
      if (props.height) {
        style.height = `${props.height}px`
      }
      return style
    })

    let quill: any = null
    let currentValue = ''

    // 监听value
    watch(() => props.value, (val) => {
      if (val !== currentValue) {
        currentValue = val === null ? '' : val
        if (quill) {
          quill.pasteHTML(currentValue)
        }
      }
    }, { immediate: true })

    // 初始化
    onMounted(() => init())

    const options = {
      theme: "snow",
      bounds: document.body,
      debug: "warn",
      modules: {
        // 工具栏配置
        toolbar: [
          ["bold", "italic", "underline", "strike"],       // 加粗 斜体 下划线 删除线
          ["blockquote", "code-block"],                    // 引用  代码块
          [{ list: "ordered" }, { list: "bullet" }],       // 有序、无序列表
          [{ indent: "-1" }, { indent: "+1" }],            // 缩进
          [{ size: ["small", false, "large", "huge"] }],   // 字体大小
          [{ header: [1, 2, 3, 4, 5, 6, false] }],         // 标题
          [{ color: [] }, { background: [] }],             // 字体颜色、字体背景颜色
          [{ align: [] }],                                 // 对齐方式
          ["clean"],                                       // 清除文本格式
          ["link", "image", "video"]                       // 链接、图片、视频
        ],
      },
      placeholder: "请输入内容",
      readOnly: false,
    }
    const editor: any = ref()
    // 初始化编辑器
    const init = () => {
      quill = new Quill(editor, options)
      quill.pasteHTML(currentValue)
      quill.on("text-change", () => {
        const html = editor.children[0].innerHTML
        const text = quill.getText()
        currentValue = html
        ctx.emit("input", html)
        ctx.emit("on-change", { html, text, quill })
      });
      quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
        ctx.emit("on-text-change", delta, oldDelta, source)
      });
      quill.on("selection-change", (range: any, oldRange: any, source: any) => {
        ctx.emit("on-selection-change", range, oldRange, source)
      });
      quill.on("editor-change", (eventName: any, ...args: any) => {
        ctx.emit("on-editor-change", eventName, ...args)
      });
    }
    
    onBeforeUnmount(() => quill = null)

    return { styles, editor }
  }
})
</script>

<style>
.editor,
.ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
</style>