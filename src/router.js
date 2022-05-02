import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      meta: { auth: false },
      component: () => import('@/views/login')
    },
    {
      path: '/home',
      name: 'home',
      meta: { auth: true },
      component: () => import('@/views/home'),
      redirect:'/welcome',
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component: () => import('@/views/welcome'),
        },
        // 用户
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/users'),
        },
        // 角色列表
        {
          path: '/roles',
          name: 'roles',
          component: () => import('@/views/roles'),
        },
        // 权限列表
        {
          path: '/rights',
          name: 'rights',
          component: () => import('@/views/rights'),
        },
        // 商品列表
        {
          path: '/goods',
          name: 'goods',
          component: () => import('@/views/goods'),
        },
        // 商品添加列表
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: () => import('@/views/goodsadd'),
        },
        // 商品分类列表
        {
          path: '/categories',
          name: 'categories',
          component: () => import('@/views/categories'),
        }
      ]
    },
  ]
})


// 路由守卫
router.beforeEach((to, from, next) => {
  const flag = to.matched.some((item) => {
    return item.meta.auth
  })
  // 判断是否鉴权
  if (flag) {
    const token = sessionStorage.getItem('token')
    if (!token) {
      // router.replace('/login')
      return next({
        path: '/login'
      })
    }
    next()
  } else {
    next()
  }
})

export default router
