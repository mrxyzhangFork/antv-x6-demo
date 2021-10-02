import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/X6/index' },
    { path: '/dnd', component: '@/pages/examples/Dnd' },
    { path: '/test', component: '@/pages/test' },
  ],
  // fastRefresh: {}, 
});
