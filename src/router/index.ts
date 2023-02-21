//在vue-router引入createRouter和createWebHashHistory
import {createRouter,createWebHashHistory} from "vue-router";
//引入组件，及要跳转到的页面，也可以直接写在routes中的component里
import Login from "../pages/Login/login.vue";
import Home from "../pages/Home/home.vue"
import NotFount from "../pages/Noufount/notfount.vue"
import seel_pwdVue from "../pages/seek_pwd/seel_pwd.vue";
//定义路由，每个路由都需要映射到一个组件。
const routes = [
  //登录页面
  { 
    path: '/', 
    redirect:"/login"
  },
  // 登录页面
  {
    path:"/login",
    name:"login",
    component: Login 
  },
  // 首页
  {
    path: '/Home',
    component: Home
  },
  //忘记密码
  {
    path: '/sell',
    component: seel_pwdVue
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    component: NotFount
  },
]

//创建路由实例并传递routes配置
const router = createRouter({
  //内部提供了history模式的实现。为了简单起见，我们在这里使用hash模式。
  history: createWebHashHistory(),
  routes, //'routes: routes' 的缩写
})

//暴露出router实例。方便在其他组件更改路由
//这样可以在任意组件中以 this.$router的形式访问它，并且以this.$route的形式访问当前路由
export default router;
