import request from '@/utils/request'
import { LoginType } from '@/types/user'

export function login(data: LoginType) {
  return request({
    url: '/tokens',
    method: 'post',
    data
  })
}

export function getInfo(token: string) {
  return request({
    url: 'system/user/currentUser',
    method: 'get',
    params: { token }
  })
}


export function logout(sUserCode: string) {
  return request({
    url: `/tokens/${sUserCode}`,
    method: 'delete'
  })
}

interface PassWordType {
  sUserId: string;
  oldPassword: string;
  newPassword: string;
  sPassword: string;
}

// 验证原始密码是否正确
export function verification(data: PassWordType) {
  return request({
    url: `system/user/verification`,
    method: 'post',
    data
  })
}
// 密码修改
export function modify(data: PassWordType) {
  return request({
    url: `system/user/modify`,
    method: 'put',
    data
  })
}

// 获取医院信息
export function getHospitalData() {
  return request({
    url: `system/user/org`,
    method: 'get',
  })
}

// 获取医院信息
export function getMenuPermission() {
  return request({
    url: `sysmenu/getMenuPermission`,
    method: 'get',
  })
}

// 获取未读消息数量
export function getMessageData() {
  return request({
    url: `msgInfo/getMsg`,
    method: 'get',
    params: { isLoading: 1 }
  })
}
