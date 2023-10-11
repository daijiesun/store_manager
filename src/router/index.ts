import { SSStorate } from "@/utils/storage"
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/login",
    component: () => import("@/pages/login/Login.vue")
  },
  {
    path: "/",
    component: () => import("@/pages/Layout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/pages/home/Dashbord.vue")
      },{
        path: "user/list",
        component: () => import("@/pages/users/List.vue") // 用户列表
      },  {
        path: "article/list",
        component: () => import("@/pages/article/List.vue")
      },{
        path: "article/typeList",
        component: () => import("@/pages/article/TypeList.vue")
      }, {
        path: "config/base",
        component: () => import("@/pages/config/Base.vue")
      }, {
        path: "/:catchAll(.*)",
        component: () => import("@/pages/NotFound.vue")
      }
    ]
  }
]


export const router = createRouter({
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach((to, from, next) => {
  const token = SSStorate.getItem('token');
  if (to.path !== '/login') {
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else if (token) {
    next('/')
  } else {
    next()
  }
})