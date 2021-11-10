import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import baseUrl from '@/config/baseUrl'
import Message from '@/utils/message'
import { ElMessageBox, ElLoading, ILoadingInstance } from 'element-plus'
import { getToken } from '@/utils/auth'
import userStore from '@/store/user'
import settings from '@/settings'

let baseURL = baseUrl
if (process.env.NODE_ENV === 'development' && settings.useProxy) {
  baseURL = '/api'
}
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL,
  // 超时
  timeout: 60000 * 10,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json',
  }
})

let loading: ILoadingInstance // 加载动画
let hasPermission: boolean = false // 当401时会弹层提示 此字段用来防止二次弹层
const indexPath: string = process.env.NODE_ENV === 'production' ? window.globalVar.indexPath : '/'

// 请求拦截器
service.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getToken()
  const userInfo = userStore && userStore.getState()
  if (token && userInfo && token !== userInfo.token) {
    return location.href = indexPath;
  }
  // 请求头中添加当前组织id
  config.headers.CURRENT_ORG_ID = userInfo && userInfo.currentOrg

  if (userInfo && userInfo.token) {
    config.headers['X-AUTH-TOKEN'] = token
  }
  // 判断是否需要价值动画
  const flag = (config.params && config.params.ElementLoading) ? config.params :
      (config.data && config.data.ElementLoading) ? config.data : null

  if (flag) {
    if (flag) {
      delete flag.ElementLoading
    }
    loading = ElLoading.service({
      text: '操作中...',
      spinner: 'el-icon-loading ElementLoading',
      background: 'rgba(0, 0, 0, 0.2)'
    })
  }
  return config
},
  (error: AxiosError) => {
    return Promise.reject(error)
  })

// 响应拦截器
service.interceptors.response.use((response) => {
  if (loading) {
    loading.close()
  }
  const res = response.data
  if (!res.ok) {
    if (res.respCode === '-1') { // 默认-1  只有为-1时才做轻提示
      const message = res.message.replace(/^\s*|\s*$/g, '') || '服务端错误'
      Message({
        message,
        type: 'warning',
        duration: 5 * 1000
      })
    }
    return Promise.reject(res)
  } else {
    return res
  }
},
  (error: AxiosError) => {
    if (loading) {
      loading.close()
    }
    if (!error.response) {
      if (error.message.includes('timeout')) {
        Message({
          message: '请求超时',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        console.log(error.message)
      }
    } else {
      const status = error.response.status
      if (status === 401) {
        if (!hasPermission) {
          setTimeout(() => {
            const currentPath = location.hash.match(/(\w+)\/?/)
            const isLoadingPath = currentPath && currentPath[0] === 'login'
            if (!isLoadingPath) {
              hasPermission = true
              ElMessageBox.confirm('系统已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                userStore.fedLogOut()
                location.reload()
              }).catch(() => hasPermission = false)
            } else {
              Message({
                message: '系统已注销，请重新登录',
                type: 'warning',
                duration: 3 * 1000
              })
            }
          }, 300)
        }
      } else if (status === 404) {
        Message({
          message: '访问资源未找到',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: '服务端错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject()
  }
)

service.get = (url, params, headers = {}): any => {
  return service({
    url,
    method: 'get',
    params,
    headers
  })
}

service.put = (url, data): any => {
  return service({
    url,
    method: 'put',
    data
  })
}

service.post = (url, data): any => {
  return service({
    url,
    method: 'post',
    data
  })
}

service.delete = (url, params): any => {
  return service({
    url,
    method: 'delete',
    params
  })
}

export default service
