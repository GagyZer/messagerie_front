  import { createRouter, createWebHistory } from 'vue-router'
  import HomeView from '@/views/HomeView.vue'
  import LoginView from '@/views/LoginView.vue'
  import ConversationView from "@/views/ConversationView.vue"; // Ajoutez cette ligne pour importer LoginView


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
      },
      {
        path: '/conversation/:conversationId', // Ajoutez une route dynamique
        name: 'conversation',
        component: ConversationView, // Importez la vue de la conversation
        props: true // Permet de passer l'ID de la conversation comme propriété à la vue
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
