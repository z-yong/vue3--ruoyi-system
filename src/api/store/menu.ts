import request from '@/utils/request'

// 获取路由
export const getRouters = (params: { nType: number }) => {
  return request({
    url: '/sysmenu/getRoleMenusByUser',
    method: 'get',
    params
  })
}

