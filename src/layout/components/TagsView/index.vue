<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" :scrollLeft="scrollLeft"
      @scroll="handleScroll">
      <div id="visitedViewsDomBox">
        <transition-group>
          <router-link v-for="tag in visitedViews" :key="tag.path" :ref="tagDoms"
            :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
            class="tags-view-item" :style="activeStyle(tag)"
            @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
            @contextmenu.prevent="openMenu(tag, $event)">
            {{ tag.title }}
            <span></span>
            <span v-if="!isAffix(tag)" class="el-icon-close"
              @click.prevent.stop="closeSelectedTag(tag)" />
          </router-link>
        </transition-group>
      </div>
    </scroll-pane>
    <transition name="toast">
      <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
        <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
        <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
        <li @click="closeOthersTags">关闭其他</li>
        <li @click="closeAllTags(selectedTag)">关闭所有</li>
      </ul>
    </transition>
  </div>
</template>

<script lang='ts'>
import ScrollPane from './ScrollPane.vue'
import draggable from 'vuedraggable'
import path from 'path'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import tagsViewStore from '@/store/tagsView'
import permissionStore from '@/store/permission'
import settingsStore from '@/store/settings'
import Sortable from 'sortablejs'
import { colorRgba } from '@/utils'

export default defineComponent({
  components: { ScrollPane, draggable },
  setup() {
    const visible = ref(false)
    const top = ref(0)
    const left = ref(0)
    const scrollLeft = ref(0)
    const selectedTag = ref<RouteLocationNormalizedLoaded>({
      name: '',
      path: '',
      fullPath: '',
      query: {},
      hash: '',
      params: {},
      redirectedFrom: undefined,
      meta: {},
      matched: [],
    })

    const route = useRoute()
    const router = useRouter()

    // 拖拽排序
    nextTick(() => {
      Sortable.create(document.querySelector('#visitedViewsDomBox'), {
        animation: 800,
      })
    })

    onMounted(() => {
      initTags()
      addTags()
    })

    watch(
      () => route.path,
      (val) => {
        addTags()
        moveToCurrentTag()
      }
    )

    watch(
      () => visible.value,
      (val) => {
        if (val) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      }
    )

    const visitedViews = computed(() => tagsViewStore.getState().visitedViews)
    const routes = computed(() => permissionStore.getState().routes)
    const theme = computed(() => settingsStore.getState().theme)

    const isActive = (tag) => {
      return route.path === tag.path
    }
    const activeStyle = (tag) => {
      if (!isActive(tag)) return {}
      return {
        color: theme.value,
        border: 'none',
        'background-color': colorRgba(theme.value, 0.1),
      }
    }
    const isAffix = (tag) => {
      return tag.meta && tag.meta.affix
    }

    type TagsType = RouteLocationNormalizedLoaded & {
      fullPath: string
      to?: TagsType
    }
    const filterAffixTags = (routes, basePath = '/') => {
      if (!routes.length) return []
      let tags: TagsType[] = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
            hash: '',
            params: {},
            query: {},
            redirectedFrom: undefined,
            matched: [],
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    let affixTags: TagsType[] = []
    const initTags = () => {
      affixTags = filterAffixTags(routes.value) || []
      for (const tag of affixTags) {
        if (tag.name) {
          tagsViewStore.addVisitedView(tag)
        }
      }
    }

    const addTags = () => {
      const { name } = route
      if (name) {
        tagsViewStore.addView(route)
      }
      return false
    }

    // 存储dom数组<TagsType[] & HTMLElement[]>
    type TagsDomType = TagsType & HTMLElement
    const tags = ref<TagsDomType[]>([])
    const tagDoms = (el) => {
      tags.value.push(el)
    }
    const scrollPane = ref()
    const moveToCurrentTag = () => {
      if (!tags.value) return
      nextTick(() => {
        for (const tag of tags.value) {
          if (tag && tag.to && tag.to.path === route.path) {
            // scrollPane.value.moveToTarget(tag)
            moveToTarget(tag)
            if (tag.to.fullPath !== route.fullPath) {
              tagsViewStore.updateVisitedView(route)
            }
            break
          }
        }
      })
    }

    const tagAndTagSpacing = 4
    const moveToTarget = (currentTag) => {
      const container: HTMLElement | null =
        document.querySelector('.scroll-container')
      if (!container) return
      const containerWidth = container.offsetWidth

      let firstTag: TagsDomType | null = null
      let lastTag: TagsDomType | null = null

      // find first tag and last tag
      if (tags.value.length > 0) {
        firstTag = tags.value[0]
        lastTag = tags.value[tags.value.length - 1]
      }

      if (firstTag === currentTag) {
        scrollLeft.value = 0
      } else if (lastTag === currentTag) {
        const scrollbarWrap =
          document.getElementsByClassName('el-scrollbar__wrap')[1]
        if (!scrollbarWrap) return
        scrollLeft.value = scrollbarWrap.scrollWidth - containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tags.value.findIndex((item) => item === currentTag)
        const prevTag = tags.value[currentIndex - 1]
        const nextTag = tags.value[currentIndex + 1]

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > scrollLeft.value + containerWidth) {
          scrollLeft.value = afterNextTagOffsetLeft - containerWidth
        } else if (beforePrevTagOffsetLeft < scrollLeft.value) {
          scrollLeft.value = beforePrevTagOffsetLeft
        }
      }
    }

    const refreshSelectedTag = (view) => {
      tagsViewStore.delCachedView(view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath,
          })
        })
      })
    }
    const closeSelectedTag = (view) => {
      tagsViewStore.delView(view).then((res: any) => {
        if (isActive(view)) {
          toLastView(res.visitedViews, view)
        }
      })
    }
    const closeOthersTags = () => {
      router.push(selectedTag.value).catch(() => {})
      tagsViewStore.delOthersViews(selectedTag.value as TagsType).then(() => {
        moveToCurrentTag()
      })
    }
    const closeAllTags = (view) => {
      tagsViewStore.delAllViews().then((res: any) => {
        if (affixTags.some((tag) => tag.path === route.path)) {
          return
        }
        toLastView(res.visitedViews, view)
      })
    }
    const toLastView = (visitedViews, view) => {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        if (view.name === 'Dashboard') {
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }
    const openMenu = (tag, e) => {
      const menuMinWidth = 105
      const tagsViewContainer: HTMLElement | null = document.getElementById(
        'tags-view-container'
      )
      if (!tagsViewContainer) return
      const offsetLeft = tagsViewContainer.getBoundingClientRect().left // container margin left
      const offsetWidth = tagsViewContainer.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const myleft = e.clientX - offsetLeft + 15 // 15: margin right
      if (myleft > maxLeft) {
        left.value = maxLeft
      } else {
        left.value = myleft
      }

      top.value = e.clientY
      visible.value = true
      selectedTag.value = tag
    }
    const closeMenu = () => {
      visible.value = false
    }
    const handleScroll = () => {
      closeMenu()
    }
    return {
      visible,
      top,
      left,
      selectedTag,
      visitedViews,
      scrollPane,
      scrollLeft,
      route,
      tagDoms,
      isActive,
      activeStyle,
      isAffix,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      openMenu,
      handleScroll,
    }
  },
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 36px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    #visitedViewsDomBox {
      display: flex;
      align-items: center;
    }
    .tags-view-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      line-height: 36px;
      color: #999;
      background: #fff;
      padding-left: 12px;
      padding-right: 8px;
      font-size: 12px;
      border-right: solid 1px #eee;
      // &:first-of-type {
      //   margin-left: 15px;
      // }
      &:last-of-type {
        margin-right: 10px;
      }
      .el-icon-close {
        display: inline-block;
        width: 15px;
        height: 15px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        margin-left: 5px;
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -2px;
        }
        &:hover {
          background-color: #d1d6df;
          color: #fff;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    z-index: 3000;
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
