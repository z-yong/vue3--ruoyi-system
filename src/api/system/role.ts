import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/role/getById/' + roleId,
    method: 'get'
  })
}

// 创建角色
export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  return request({
    url: '/role/updateStatus',
    method: 'get',
    params: {
      roleId,
      status
    }
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/role/deleteById/' + roleId,
    method: 'get'
  })
}

// 获取已关联用户信息
export function getHavenUserList(roleId: string) {
  return request({
    url: '/system/role/user?sRoleId=' + roleId,
    method: 'get'
  })
}

interface GetOptionalUserType {
  pageNum: number;
  pageSize: number;
  userName?: string
}
export function getOptionalUser(params: GetOptionalUserType) {
  return request({
    url: '/system/org/optionalUser2',
    method: 'get',
    params
  })
}

interface AddRoleType {
  sRoleId: string,
  sUserIds: string[]
}
export function addRole(data: AddRoleType) {
  return request({
    url: '/system/role/user',
    method: 'post',
    data
  })
}

// 删除用户对照
interface UserContrast {
  sRoleId: string,
  sUserId: string
}
export function delUserContrast(data: UserContrast) {
  return request({
    url: '/role/user',
    method: 'delete',
    data
  })
}

export function getRoleAll(sUserId) {
  return request({
    url: `/system/user/roleAll${sUserId}`,
    method: 'get'
  })
}
