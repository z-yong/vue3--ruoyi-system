/*
 * @Autor: yong.zhu
 * @Date: 2021-11-10 16:45:41
 * @LastEditors: yong.zhu
 * @LastEditTime: 2021-11-16 08:47:48
 * @Description: 
 * @Version: 1.0
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module 'vue'
declare module '*.scss'
declare module '*.js'
declare module 'quill'
declare module 'js-cookie'
interface GlobalType {
  baseUrlDev: string;
  indexPath: string;
  isHighInterface: string;
  logoBgUrl: string;
  cmsName: string;
  logoUrl: string;
  loginLeftImgUrl: string;
}

interface Window {
  globalVar: GlobalType;
}
