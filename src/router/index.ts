import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../components/login.vue'),
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../../components/Home.vue'),

    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
