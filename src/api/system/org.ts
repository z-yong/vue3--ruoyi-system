import request from '@/utils/request'

// 查询组织架构--不分页
export const getOrgAll = (sUserId) => {
  return request({
    url: `/system/user/orgAll?sUserId=${sUserId}`,
    method: 'get'
  })
}
