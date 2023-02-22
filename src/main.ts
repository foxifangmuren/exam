import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { useRouter } from 'vue-router';
const route = useRouter();

import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
//引入axios
import axios from 'axios';
import VueAxios from 'vue-axios';
import './assets/icon/iconfont.css';
createApp(App)
  .use(VueAxios, axios)
  .use(ElementPlus, { locale: zhCn })
  .use(router)
  .mount('#app');
