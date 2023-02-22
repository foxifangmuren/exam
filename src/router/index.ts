//在vue-router引入createRouter和createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router';
//引入组件，及要跳转到的页面，也可以直接写在routes中的component里
import Login from '../pages/Login/login.vue';
import Home from '../pages/Home/home.vue';
import test from '../pages/Home/children/Text/Text.vue';
import Exam from '../pages/Home/children/Exam/Exam.vue';
import Exam_student from "../pages/Home/children/Exam/examstudent.vue"
import role from '../pages/Home/children/role/role.vue';
import student from '../pages/Home/children/student/student.vue';
import classes from '../pages/Home/children/classes/classes.vue';
import Department from '../pages/Home/children/Department/Department.vue';
import teacher from '../pages/Home/children/teacher/teacher.vue';
import Subjects from '../pages/Home/children/Subjects/Subjects.vue';
import Databaselist from '../pages/Home/children/Databaselist/Databaselist.vue';
import NotFount from '../pages/Noufount/notfount.vue';
import seel_pwdVue from '../pages/seek_pwd/seel_pwd.vue';
//定义路由，每个路由都需要映射到一个组件。
const routes:any = [
  //登录页面
  {
    path: '/',
    redirect: '/login',
  },
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  // 首页
  {
    path: '/Home',
    name:Home,
    component: Home,
    children: [
      // "考试"
      {
        path: '/test',
        name:test,
        component: test,
      },
      // "阅卷"
      {
        path: '/exam',
        name: Exam,
        component: ()=>import('../pages/Home/children/Exam/Exam.vue'),
      },
      {
        path:"/Exam_student",
        name:Exam_student,
        component:Exam_student
      },
      // "试卷"
      {
        path: '/subjects',
        name: Subjects,
        component: Subjects,
      },
       // ""题库""
       {
        path: '/databaselist',
        name: Databaselist,
        component: Databaselist,
      },
       // ""部门"
       {
        path: '/department',
        name: Department,
        component: Department,
      },
      
       // "/师资"
       {
        path: "/teacher",
        name: teacher,
        component: teacher,
      },
      // "班级"
      {
        path: "/classes",
        name: classes,
        component: classes,
      },
      
       // "学员"
       {
        path: "/student",
        name: student,
        component: student,
      },
       // "角色"
       {
        path: "/role",
        name: role,
        component: role,
      },
    ],
  },

  //忘记密码
  {
    path: '/sell',
    component: seel_pwdVue,
  },
  //微信扫码登录
  
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    component: NotFount,
  },
];

//创建路由实例并传递routes配置
const router = createRouter({
  //内部提供了history模式的实现。为了简单起见，我们在这里使用hash模式。
  history: createWebHashHistory(),
  routes, //'routes: routes' 的缩写
});

//暴露出router实例。方便在其他组件更改路由
//这样可以在任意组件中以 this.$router的形式访问它，并且以this.$route的形式访问当前路由
export default router;
