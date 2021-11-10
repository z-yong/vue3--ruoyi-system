<template>
  <transition>
    <div class="imagePopup-wrap" v-if="visible">
      <div class="image-mask" @click.stop="close"></div>
      <div class="image-wrap">
        <i class="el-icon-close image-close" title="关闭" @click.stop="close"></i>
        <div class="img-box">
          <img :src="url" class="img">
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    const close = () => {
      ctx.emit('update:visible', false)
    }
    return { visible: props.visible, title: props.title, url: props.url, close }
  },
})
</script>

<style>
.imagePopup-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.image-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.image-title {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 1.5s ease;
}

.image-wrap:hover > .image-title {
  opacity: 0.9;
}

.image-close {
  position: absolute;
  right: 8%;
  top: 8%;
  z-index: 3;
  color: #fff;
  cursor: pointer;
  font-size: 26px;
  text-align: center;
}
.img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  max-height: 80%;
}
</style>