import request from '@/utils/request'

// 获取供应商列表
export function getSupOpt() {
  return request({
    url: '/basic/supplier',
    method: 'get'
  })
}
