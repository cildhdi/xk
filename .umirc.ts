import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  routes: [
    { path: '/login', component: '@/pages/login' },
    { path: '/', component: '@/pages/index' },
  ],
});
