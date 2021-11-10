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
  hospitalName: string;
  isHighInterface: string;
  logoBgUrl: string;
  cmsName: string;
  logoUrl: string;
  loginLeftImgUrl: string;
}

interface Window {
  globalVar: GlobalType;
}
