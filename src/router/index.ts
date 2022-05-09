import { SSStorate } from "@/utils/storage"
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
  {
    path: "/login",
    component: () => import("@/pages/Login.vue")
  }, {
    path: "/",
    component: () => import("@/pages/Layout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/pages/home/Dashbord.vue")
      }, {
        path: "/goods/list",
        component: () => import("@/pages/goods/List.vue")
      }, {
        path: "/goods/typeList",
        component: () => import("@/pages/goods/TypeList.vue")
      }, {
        path: "/config/base",
        component: () => import("@/pages/config/Base.vue")
      }
    ]
  }
]


export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),//createWebHistory(),
  routes, // `routes: routes` 的缩写
})

// router.beforeEach((to, from, next) => {
//   const token = SSStorate.getItem('token');
//   if (to.path !== '/login') {
//     if (!token) {
//       next('/login')
//     } else {
//       next()
//     }
//   } else if (token) {
//     next('/')
//   }else{
//     next()
//   }
// })