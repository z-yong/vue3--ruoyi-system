<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination :background="background" v-model:current-page="currentPage"
      v-model:page-size="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total"
      v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script lang='ts'>
import { scrollTo } from '@/utils/scroll-to'
import { defineComponent } from 'vue'
import { computed } from '@vue/reactivity'
export default defineComponent({
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 15,
    },
    pageSizes: {
      type: Array,
      default() {
        return [15, 30, 50, 100, 200]
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, ctx) {
    const currentPage = computed({
      get() {
        return props.page
      },
      set(val) {
        ctx.emit('update:page', val)
      },
    })
    const pageSize = computed({
      get() {
        return props.limit
      },
      set(val) {
        ctx.emit('update:limit', val)
      },
    })

    const handleSizeChange = (val) => {
      ctx.emit('pagination', { page: currentPage.value, limit: val })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }
    const handleCurrentChange = (val) => {
      ctx.emit('pagination', { page: val, limit: pageSize.value })
      if (props.autoScroll) {
        scrollTo(0, 800)
      }
    }
    return { currentPage, pageSize, handleSizeChange, handleCurrentChange }
  },
})
</script>

<style scoped>
.pagination-container {
  background: #fff;
}
.pagination-container.hidden {
  display: none;
}
</style>
