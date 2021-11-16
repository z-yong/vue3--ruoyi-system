/*
 * @Autor: yong.zhu
 * @Date: 2021-11-10 16:45:42
 * @LastEditors: yong.zhu
 * @LastEditTime: 2021-11-16 08:51:25
 * @Description: 接口地址
 * @Version: 1.0
 */
const urlS1 = 'http://192.168.1.96:8181/jxhscp' // 开发库

let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  baseUrl = urlS1
} else if (process.env.NODE_ENV === 'production') {
  // 生产环境
  baseUrl = window.globalVar.baseUrlDev // 打包: 开发库 urlS1   |   测试库 urlS4   |   标准上线库 urlS3
}
export default baseUrl
