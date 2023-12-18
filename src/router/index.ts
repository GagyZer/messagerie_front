  import { createRouter, createWebHistory } from 'vue-router'
  import HomeView from '@/views/HomeView.vue'
  import LoginView from '@/views/LoginView.vue' // Ajoutez cette ligne pour importer LoginView


  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/home',
        name: 'home',
        component: HomeView
      },
      {
        path: '/', // Ajoutez cette nouvelle route
        name: 'login',
        component: LoginView
      }
    ]
  })

  /**
   * On regarde dans le sessionStorage si on a déjà définit la clé jwt; si c'est le cas l'utilisateur est connecté
   *
   * @returns l'état de connexion de l'utilisateur
   */
  export function isAuthenticated() {
    return !!sessionStorage.getItem('jwt')
  }


  export default router
