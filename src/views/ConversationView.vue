<template>
  <div>
    <button @click="closeConversation" class="ml-1.5 mt-1.5 bg-red-500 px-4 py-2 rounded text-white">
      Quitter
    </button>
    <div class="message-input">
      <input v-model="newMessage" placeholder="Tapez votre message..." />
      <button @click="sendMessage" class="bg-blue-700 rounded text-white mr-2 px-4 py-2">Envoyer</button>
    </div>
    <div v-if="messages.length">
      <template v-for="message in messages" :key="message._id">
        <div>{{ message.content }}</div>
        <!-- Ajoutez ici le code pour afficher d'autres détails du message si nécessaire -->
      </template>
    </div>
  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue';
import axios from "axios";
import {useRoute, useRouter} from 'vue-router';



const newMessage = ref('');
const router = useRouter()
const route = useRoute();
const conversationId = route.params.conversationId;
const messages = ref([]);


const closeConversation = () => {
  // Rediriger vers la page d'accueil
  router.push('/home');
};

const sendMessage = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.post(`http://localhost:5000/conversations/${conversationId}`, {
      messageContent: newMessage.value,
    }, {
      headers: {
        Authorization:token,
      },
    });

    console.log('Message envoyé avec succès:', response.data);
    newMessage.value = '';
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
  }
};


const fetchMessages =async () => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get(`http://localhost:5000/conversations/${conversationId}`, {
      headers: {
        Authorization: token,
      },
    });

    console.log('Messages récupérés:', response.data.messages);
    messages.value = response.data.messages;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages de la conversation', error);
  }
}



onMounted(async () => {
  await fetchMessages();
})
</script>

<style scoped>

.message-input {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.message-input input {
  flex: 1;
  padding: 8px;
}

.message-input button {
  margin-left: 8px;
}
</style>