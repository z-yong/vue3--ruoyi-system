<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
import permissionStore from '@/store/permission'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const levelList: any = ref([])

    const route = useRoute()
    const router = useRouter()

    const findPathNum = (str: string, char = '/') => {
      let index = str.indexOf(char)
      let num = 0
      while (index !== -1) {
        num++
        index = str.indexOf(char, index + 1)
      }
      return num
    }

    const isDashboard = (route: any) => {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === '首页'
    }

    // 获取缓存路由列表
    const getBreadcrumb = () => {
      let matched: any[] = []
      const pathNum = findPathNum(route.path)
      // 当前菜单的上级目录超过两个时
      // (route中matched记录只保留两层, 故两层以上通过菜单数组sidebarRouters进行遍历查找)
      if (pathNum > 2) {
        const reg = /\/\w+/gi
        const routeList = route.path.match(reg) || []
        const pathList = routeList.map((item, index) => {
          if (index !== 0) item = item.slice(1)
          return item
        })
        getMatched(pathList, permissionStore.getState().sidebarRouters, matched)
      } else {
        matched = route.matched.filter((item) => item.meta && item.meta.title)
      }
      if (!isDashboard(matched[0])) {
        matched = [{ path: '/index', meta: { title: '首页' } }].concat(matched)
      }

      levelList.value = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }

    const getMatched = (
      pathList: string[],
      routeList: RouteRecordRaw[],
      matched: any[]
    ) => {
      const data = routeList.find((item) => item.path === pathList[0])
      matched.push(data)
      if (data && data.children && pathList.length) {
        pathList.shift()
        getMatched(pathList, data.children, matched)
      }
    }

    const handleLink = (item: any) => {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
        return
      }
      router.push(path)
    }

    // 监听路由变化
    watch(
      () => route.path,
      (path) => {
        if (path.startsWith('/redirect/')) {
          return
        }
        getBreadcrumb()
      },
      { immediate: true }
    )

    return { levelList, handleLink }
  },
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
