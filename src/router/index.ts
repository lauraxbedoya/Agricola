import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AdminUsersView from '@/views/AdminUsersView.vue'
import FarmView from '@/views/FarmView.vue'
import LotView from '@/views/LotView.vue'
import GroupView from '@/views/GroupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/users',
      name: 'admin-users',
      component: AdminUsersView
    },
    {
      path: '/farms',
      name: 'farms',
      component: FarmView
    },
    {
      path: '/lots/:farmId',
      name: 'lots',
      component: LotView
    },
    {
      path: '/groups/:lotId',
      name: 'groups',
      component: GroupView
    }
  ]
})

export default router
