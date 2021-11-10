import axios from 'axios'
import baseUrl from '@/config/baseUrl'
import { getToken } from '@/utils/auth'

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
}

export function downLoadZip(str, filename) {
  const url = baseUrl + str
  axios({
    url,
    method: 'get',
    responseType: 'blob',
    headers: { Authorization: 'Bearer ' + getToken() }
  }).then((res) => {
    resolveBlob(res, mimeMap.zip)
  })
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a')
  const blob = new Blob([res.data], { type: mimeType })
  // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const contentDisposition = decodeURI(res.headers['content-disposition'])
  const result: any = patt.exec(contentDisposition)
  let fileName = result[1]
  fileName = fileName.replace(/\"/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.appendChild(aLink)
}
