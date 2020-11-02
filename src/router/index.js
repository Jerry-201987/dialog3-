import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)
let router = new VueRouter({
    routes: [
        {
            path: "/",
            meta: { title: "首页" },
            component: () => import('~~/Home')
        }
    ]
})

//路由跳转之前会被此处拦截
router.beforeEach((to, from, next) => {
    next()
})

//路由跳转之后会被此处拦截
router.afterEach(() => {
})

export default router