<template>
  <div v-if="!item.meta.hidden">
    <template v-if="hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }">
          <TooltipOver :content="onlyOneChild.meta.title" placement="right"
            :refName="'tooltipOver' + onlyOneChild.path + onlyOneChild.meta.title">
            <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
              :title="onlyOneChild.meta.title" />
          </TooltipOver>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body
      :hide-timeout="0">
      <template v-slot:title>
        <TooltipOver v-if="item.meta" :content="item.meta.title" placement="right"
          :refName="'tooltipOver' + item.path + item.meta.title"
          :icon="item.meta && item.meta.icon">
          <item :icon="item.meta && item.meta.icon" :title="item.meta.title" />
        </TooltipOver>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
import AppLink from './Link.vue'
import TooltipOver from '@/components/TooltipOver/index.vue'
import { ref } from '@vue/reactivity'
import appStore from '@/store/app'
import { computed } from 'vue'
import { onMounted } from 'vue'

export default defineComponent({
  components: { Item, AppLink, TooltipOver },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const item = props.item
    const isNest = props.isNest
    const basePath = props.basePath

    const device = computed(() => appStore.getState().device)

    const subMenu = ref()
    const fixBugIniOS = () => {
      if (subMenu.value) {
        const handleMouseleave = subMenu.value.handleMouseleave
        subMenu.value.handleMouseleave = (e) => {
          if (device.value === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }
    onMounted(fixBugIniOS)

    const onlyOneChild = ref(null)

    const hasOneShowingChild = (children = [], parent) => {
      if (!children) {
        children = []
      }
      const showingChildren = children.filter((item: any) => {
        if (item.hidden) {
          return false
        } else {
          onlyOneChild.value = item
          return true
        }
      })

      // 只有一个子路由器时，默认显示子路由器
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有要显示的子路由器，则显示parent
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }
    const resolvePath = (routePath) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(basePath)) {
        return basePath
      }
      return path.resolve(basePath, routePath)
    }

    return {
      item,
      isNest,
      basePath,
      subMenu,
      onlyOneChild,
      hasOneShowingChild,
      resolvePath,
    }
  },
})
</script>
