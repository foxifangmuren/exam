import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { useRouter } from 'vue-router';
const route = useRouter();
import MyTable from "@/components/Table.vue"
import MyPages from "@/components/pages.vue"
import MyBialog from "@/components/Bialog.vue"
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
//引入axios
import axios from 'axios';
import VueAxios from 'vue-axios';
import './assets/icon/iconfont.css';
const app=createApp(App)
app.use(VueAxios, axios)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.component('MyTable',MyTable)
app.component('MyPages',MyPages)
app.component('MyBialog',MyBialog)
app.mount('#app');
