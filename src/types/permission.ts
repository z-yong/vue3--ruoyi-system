import { RouteRecordRaw } from 'vue-router'

export interface PermissionType extends Object {
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
  sidebarRouters: RouteRecordRaw[];
}
