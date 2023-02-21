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

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
