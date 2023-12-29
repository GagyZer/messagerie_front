<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-[600px] bg-white p-8 shadow-md rounded-lg">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-bold mb-2">Username</label>
          <input
              type="text"
              v-model="username"
              id="username"
              name="username"
              class="w-full border rounded py-2 px-3"
              required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
          <input
              type="password"
              v-model="password"
              id="password"
              name="password"
              class="w-full border rounded py-2 px-3"
              required
              @input="handlePasswordInput"
          />
          <!-- Validation visuelle du mot de passe -->
          <div v-if="!isPasswordValid" class="text-red-500 mt-2">
            Mot de passe invalide : il doit avoir entre 5 et 15 caractères.
          </div>
          <!-- Message d'erreur si le mot de passe ne correspond pas -->
<!--          <div v-if="loginError" class="text-red-500 mt-2">-->
<!--            Nom d'utilisateur ou mot de passe incorrect.-->
<!--          </div>-->
        </div>
        <div class="text-center">
          <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
              :disabled="!isPasswordValid"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const username = ref('');
const password = ref<string>('');
const isPasswordValid = ref(true);
const loginError = ref(false);

const submitForm = async () => {
  // Ajoutez la validation du mot de passe ici avant de soumettre le formulaire
  if (!validatePassword()) {
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/users/login', {
      username: username.value,
      password: password.value,
    });

    if (response.data.token) {
      localStorage.setItem('jwt', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/home');
    } else {
      console.error('Erreur lors de la connexion :', response.data.message);
      // Affichez le message d'erreur si le mot de passe ne correspond pas
      loginError.value = true;
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
  }
};

// Fonction pour valider le mot de passe
const validatePassword = () => {
  const isValid = password.value.length >= 5 && password.value.length <= 15;
  isPasswordValid.value = isValid;
  return isValid;
};

const handlePasswordInput = () => {
  // Mettez à jour le message d'erreur du login si le mot de passe ne correspond pas
  loginError.value = false; // Réinitialisez le message d'erreur à chaque saisie
  if (!validatePassword()) {
    loginError.value = true;
  }
};

</script>