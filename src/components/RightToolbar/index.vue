<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button size="mini" circle icon="el-icon-menu" @click="showColumn()" />
      </el-tooltip>
    </el-row>
    <el-dialog :title="title" v-model="open" append-to-body>
      <el-transfer :titles="['显示', '隐藏']" v-model="value" :data="columns" @change="dataChange">
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
    },
  },
  setup(props, ctx) {
    // 显隐数据
    const value = ref([])
    // 弹出层标题
    const title = ref('显示/隐藏')
    // 是否显示弹出层
    const open = ref(false)

    const toggleSearch = () => {
      ctx.emit('update:showSearch', !props.showSearch)
    }
    // 刷新
    const refresh = () => {
      ctx.emit('queryTable')
    }
    // 右侧列表元素变化
    const dataChange = (data) => {
      for (const item in props.columns) {
        const key = props.columns[item].key
        props.columns[item].visible = !data.includes(key)
      }
    }
    // 打开显隐列dialog
    const showColumn = () => {
      open.value = true
    }
    return { value, title, open, toggleSearch, refresh, dataChange, showColumn }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}
</style>
