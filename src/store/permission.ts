import { Store } from './index'
import { RouteRecordRaw } from 'vue-router'
import { PermissionType } from '@/types/permission'
import { routes } from '@/router'
import { getRouters } from '@/api/store/menu'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'

const state: PermissionType = {
  routes: [],
  addRoutes: [],
  sidebarRouters: []
}

class PermissionStore extends Store<PermissionType> {
  public setRoutes(data: RouteRecordRaw[]): void {
    this.state.addRoutes = data
    this.state.routes = routes.concat(data)
  }

  public setSidebarRouters(data: RouteRecordRaw[]): void {
    this.state.sidebarRouters = routes.concat(data)
  }

  // 生成路由
  public createRouters() {
    return new Promise((resolve) => {
      // 向后端请求路由数据
      getRouters({ nType: 1 }).then(({ data }) => {
        data.forEach((item) => {
          if (typeof item.hidden === 'boolean') {
            item.meta.hidden = item.hidden
          }
        })
        const sdata = JSON.parse(JSON.stringify(data))
        const rdata = JSON.parse(JSON.stringify(data))
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        rewriteRoutes.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
        const sidebarRoutes = filterAsyncRouter(sdata)
        this.setRoutes(rewriteRoutes)
        this.setSidebarRouters(sidebarRoutes)
        resolve(rewriteRoutes)
      })
    })
  }

  protected data(): PermissionType {
    return state
  }
}

export default new PermissionStore()

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any[], lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (route.hidden) {
      return false
    }
    if (type && route.children) {
      route.children = filterChildren(route.children, null)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route.children
      delete route.redirect
    }
    return true
  })
}

function filterChildren(childrenMap: any[], lastRouter: any) {
  let children: any[] = []
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view: string) => { // 路由懒加载
  return () => import(`@/views/${view}/index.vue`)
}
