const urlH8 = 'http://192.168.8.66:8888/hmms/' // 临沂妇幼正式环境
const urlH9 = 'http://192.168.8.67:8888/hmms/' // 临沂妇幼测试环境
const urlH12 = 'http://166.16.16.165:8888/hmms/' // 肿瘤正式环境
const urlS1 = 'http://192.168.1.96:8181/hmms/' // 96开发库
const urlS2 = 'http://192.168.1.96:8282/hmms/' // 96测试库
const urlS3 = 'http://36.7.136.46:8282/hmms/' // 96测试库
const urlS4 = 'http://192.168.1.96:8181/scp/' // 开发库 新
// 后端测试地址
const urlT0 = 'http://192.168.1.108:8888/hmms/' // 洪志强
const urlT1 = 'http://192.168.1.249:8484/hmms/' // 鲁先锐
const urlT2 = 'http://192.168.1.76:8888/hmms/' // 吴建敏
const urlT3 = 'http://192.168.31.208:8888/hmms/' // 谢明宏
const urlT5 = 'http://192.168.1.227:8888/hmms/' // 袁侠

const syy = 'http://117.71.57.2:8282/hmms/' // 中医院

let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  baseUrl = urlS1
} else if (process.env.NODE_ENV === 'production') {
  // 生产环境
  baseUrl = window.globalVar.baseUrlDev // 打包: 开发库 urlS1   |   测试库 urlS4   |   标准上线库 urlS3
}
export default baseUrl
