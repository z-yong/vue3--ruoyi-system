import request from '@/utils/request'

// 获取医院列表
export function getOwnerList() {
  return request({
    url: '/system/user/owner',
    method: 'get'
  })
}
