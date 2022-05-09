import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from "element-plus"
import { router } from './router'

import 'element-plus/dist/index.css'
import "./assets/css/index.less"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './element-variables.scss';

const app = createApp(App);
app.use(ElementPlus,{size: "mini",local: zhCn});
app.use(router);
app.mount('#app')
