/*
 * @Description: 项目入口
 * @Version: 1.0
 * @Autor: yong.zhu
 * @Date: 2021-09-27 16:25:41
 * @LastEditors: yong.zhu
 * @LastEditTime: 2021-10-08 17:21:07
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Cookies from 'js-cookie'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

// 公共样式
import '@/assets/styles/index.scss'
import '@/assets/icons'
// 权限控制
import './permission'
// 全局组件引入
import SvgIcon from '@/components/SvgIcon/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableColumn from '@/components/TableColumn/index.vue'
import RightToolbar from '@/components/RightToolbar/index.vue'
// 主题颜色风格逻辑引入
import theme from '@/utils/theme'
import { getSetting } from '@/utils/setting'
// 自定义指令引入
import directive from '@/directive'
// 全局mixin引入
// import mixin from '@/utils/mixin.js'
// 主题颜色风格初始化
theme(getSetting('theme'))
// 创建app
const app = createApp(App)
// 全局注册自定义指令
directive(app)
// 全局注册mixin
// app.mixin(mixin)
// 注册ElementPlus
app.use(ElementPlus, {
  locale, // 语言设置
  size: Cookies.get('size') || 'medium' // 尺寸设置
})
// 全局组件祖册
app.component(
  'SvgIcon',
  // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `.default`，否则回退到使用模块的根
  SvgIcon.default || SvgIcon
)
app.component('Pagination', Pagination)
app.component('RightToolbar', RightToolbar)
app.component('el-table-column', TableColumn)
// 注册路由
app.use(router).mount('#app')
