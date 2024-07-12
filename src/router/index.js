import { createRouter, createWebHistory } from "vue-router";
const basePath = `/`
// const basePath = '/front/manage/marketing'
const router = createRouter({
    history: createWebHistory(basePath),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('../view/home/home.vue'),
            meta: {
                title: '首页'
            }
        },
    ]
})
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })

export default router;

