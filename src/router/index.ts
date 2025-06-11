import { createRouter, createWebHistory } from 'vue-router'
import PokemonView from "../views/PokemonView.vue"
import HomeView from '../views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pokemon/:name',
      name: 'pokemon',
      component: PokemonView,
    },
    { path: "/login", name: "login", component: AuthView }
  ],
})

export default router
