<template>
  <div :class="{ show: show }" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select ref="headerSearchSelect" v-model="search" :remote-method="querySearch" filterable
      default-first-option remote placeholder="搜索" class="header-search-select" @change="change">
      <el-option v-for="option in options" :key="option.item.path" :value="option.item.path"
        :label="option.item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script lang='ts'>
import Fuse from 'fuse.js/dist/fuse.min.js'
import path from 'path'
import permissionStore from '@/store/permission'
import { defineComponent, watch, computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const routes = computed(() => permissionStore.getState().sidebarRouters)
    const show = ref(false)

    const router = useRouter()

    const search = ref('')
    const options = ref([])
    let fuse = {
      search: (query: string) => {},
    }
    const headerSearchSelect = ref()

    const click = () => {
      show.value = !show.value
      if (show.value) {
        headerSearchSelect.value.focus()
      }
    }
    const close = () => {
      headerSearchSelect.value.blur()
      options.value = []
      show.value = false
    }
    const change = (val) => {
      if (ishttp(val)) {
        window.open(val, '_blank')
      } else {
        router.push(val)
      }
      search.value = ''
      options.value = []
      nextTick(() => {
        show.value = false
      })
    }
    const initFuse = (list) => {
      fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'path', weight: 0.3 },
        ],
      })
    }

    interface Res {
      path: string
      title: string[]
    }

    const generateRoutes = (
      routes,
      basePath = '/',
      prefixTitle: string[] = []
    ) => {
      let res: Res[] = []
      if (!routes.length) return res
      for (const router of routes) {
        if (router.hidden) {
          continue
        }
        const data = {
          path: !ishttp(router.path)
            ? path.resolve(basePath, router.path)
            : router.path,
          title: [...prefixTitle],
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            res.push(data)
          }
        }
        if (router.children) {
          const tempRoutes = generateRoutes(
            router.children,
            data.path,
            data.title
          )
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }
    const querySearch = (query) => {
      if (query !== '') {
        options.value = fuse.search(query) as any
      } else {
        options.value = []
      }
    }
    const ishttp = (url) => {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    }

    watch(
      () => routes.value,
      (val) => {
        const list = generateRoutes(val)
        initFuse(list)
      },
      { immediate: true }
    )

    watch(
      () => show.value,
      (val) => {
        if (val) {
          document.body.addEventListener('click', close)
        } else {
          document.body.removeEventListener('click', close)
        }
      }
    )

    return {
      show,
      search,
      routes,
      headerSearchSelect,
      options,
      click,
      change,
      querySearch,
    }
  },
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
    &:hover {
      color: var(--theme);
    }
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
