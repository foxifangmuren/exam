import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { useRouter } from 'vue-router';
const route = useRouter();
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import MyTable from "@/components/Table.vue"
import MyPages from "@/components/pages.vue"
import MyBialog from "@/components/Bialog.vue"
import MyDialog from "@/components/Dataitem/DataDialog.vue"
import MyCDatadrawer from "@/components/Dataitem/Datadrawer.vue"
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
//引入axios
import axios from 'axios';
import VueAxios from 'vue-axios';
import './assets/icon/iconfont.css';
const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(VueAxios, axios)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
//表格
app.component('MyTable',MyTable)
//分页
app.component('MyPages',MyPages)
// 弹框
app.component('MyBialog',MyBialog)
//批量添加弹框
app.component('MyDialog',MyDialog)
//侧边弹框
app.component('MyCDatadrawer',MyCDatadrawer)
app.mount('#app');
