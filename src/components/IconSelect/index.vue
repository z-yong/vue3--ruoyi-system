<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称"
      @clear="filterIcons" @input="filterIcons">
      <template v-slot:suffix>
        <i class="el-icon-search el-input__icon" />
      </template>
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="width:16px;height:30px;margin-right:4px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import icons from './requireIcons.js'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup(props, ctx) {
    const name = ref('')
    const iconList = ref(icons)

    const filterIcons = () => {
      iconList.value = icons
      if (name.value) {
        iconList.value = iconList.value.filter((item) =>
          item.includes(name.value)
        )
      }
    }
    const selectedIcon = (name) => {
      ctx.emit('selected', name)
      document.body.click()
    }

    const reset = () => {
      name.value = ''
      iconList.value = icons
    }

    return { name, iconList, filterIcons, selectedIcon, reset }
  },
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    margin-top: 5px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
