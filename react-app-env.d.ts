/// <reference types="react-scripts" />
// 导入环境变量，需要提前声明
interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_APP_TITLE: string
    readonly VITE_HTML_TITLE: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }