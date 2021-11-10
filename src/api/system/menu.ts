import request from '@/utils/request'

// 查询菜单列表
export const listMenu = (params) => {
  return request({
    url: '/sysmenu/list',
    method: 'get',
    params
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/sysmenu/getById/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/sysmenu/getRoleMenus',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/sysmenu/getRoleMenus',
    method: 'get',
    params: {
      roleId
    }
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/sysmenu/create',
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/sysmenu/create',
    method: 'post',
    data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/sysmenu/deleteById/' + menuId,
    method: 'get'
  })
}
