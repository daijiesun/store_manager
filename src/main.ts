import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import 'element-plus/dist/index.css'
import "./assets/css/index.less"
// import './element-variables.scss'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from "element-plus"

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn,size: 'medium' })
app.use(router)
app.mount('#app')