<template>
  <main class="h-screen">
    <div class="flex flex-row h-screen">
      <div class="flex-col w-1/3 max-w-[500px]">
        <div class="bg-white p-4 shadow-md rounded-lg h-[100px]">
          <div class="flex items-center">
            <img
                :src="`https://source.unsplash.com/userid/100x100`"
                alt="User Image"
                class="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 class="text-2xl font-bold">{{ currentUser.username }}</h2>
              <span class="text-green-500">Online</span>
            </div>
          </div>
        </div>

        <!-- Liste des conversations -->
        <div v-if="conversations.length" class="mt-4">
          <h2 class="font-bold text-3xl p-2">Conversations</h2>
          <template v-for="conversation in conversations" :key="conversation._id">
            <div @click="navigateToConversation(conversation._id)" class="cursor-pointer hover:bg-gray-200 p-2 rounded">
              {{ conversation.title || 'Conversation sans titre' }}
            </div>
            <button @click="deleteConversation(conversation._id)" class="ml-2 text-red-500">Delete</button>
          </template>
        </div>
      </div>

      <div class="w-2/3 h-full px-4">
        <template v-if="true"> <!-- v if pas de conversation sélectionnée -->
          <h2 class="font-bold text-3xl p-2">Users</h2>
          <button
              :disabled="!selectedUsersIds.length"
              @click="createConversation"
              :class="twMerge(
              'py-2 px-4 my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded',
              !selectedUsersIds.length && 'bg-blue-400 cursor-not-allowed hover:bg-blue-400'
            )"
          >
            Create conversation
          </button>
          <div class="flex flew-row flex-wrap gap-2">
            <!-- Liste des utilisateurs -->
            <template v-for="user in users" :key="user._id">
              <div v-if="user._id !== currentUser._id"  @click="toggleUserSelection(user)" :class="userClass(user)">
                <img
                    :src="`https://source.unsplash.com/userid/100x100`"
                :alt="`Image de ${user.username}`"
                class="w-14 h-14 rounded-full mb-2"
                />
                <div class="relative">
                  {{ user.username }}
                  <div class="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <!-- Vue d'une conversation -->
        <template v-else>
          Conversation
        </template>
      </div>
    </div>
  </main>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { twMerge } from 'tailwind-merge'
import type {User} from "@/models/user";
import type {Conversation} from "@/models/conversation";
import axios from "axios";

const router = useRouter()

const selectedUsersIds = ref<Array<string>>([]);
const users = ref<Array<User>>([]);
const conversations = ref<Array<Conversation>>([]);
console.log(conversations);

const currentUser = ref({});

// Fonction pour récupérer la liste des utilisateurs depuis le backend
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/users/all');
    users.value = response.data.users; // Assurez-vous que la structure de votre réponse correspond à vos besoins
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
  }
};

// Fonction pour récupérer la liste des conversations depuis le backend
const fetchConversations = async () => {
  try {
    const token = localStorage.getItem('jwt'); // Récupérez le jeton d'authentification depuis le sessionStorage
    const response = await axios.get('http://localhost:5000/conversations', {
      headers:{
        Authorization:token,
      },
    });
    conversations.value= response.data.conversations;
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations', error);
  }
};

const deleteConversation = async (convId: string) => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.delete(`http://localhost:5000/conversations/${convId}`, {
      headers: {
        Authorization: token,
      },
    });

    // Filtrer les conversations après la suppression de celle avec l'ID spécifié
    conversations.value = conversations.value.filter(conversation => conversation._id !== convId);

    console.log('Conversation supprimée:', response.data.conversation);
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation', error);
  }
};

onMounted(async () => {
  await fetchUsers();
  await fetchConversations();

  currentUser.value = JSON.parse(sessionStorage.getItem('user') || '{}');
})


const createConversation = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const participantsIds = selectedUsersIds.value.map(user => user._id);

    const existingConversation = conversations.value.find(conversation =>
        conversation.participants.every(participantId => participantsIds.includes(participantId))
    );

    if (existingConversation) {
      // Rediriger vers la conversation existante
      router.push(`/conversation/${existingConversation._id}`);
      return;
    }

    const response = await axios.post('http://localhost:5000/conversations', {
      concernedUsersIds: selectedUsersIds.value.map(user => user._id),
    }, {
      headers: {
        Authorization:token,
      },
    });

    // Rediriger vers la conversation nouvellement créée
    router.push(`/conversation/${response.data._id}`);
  } catch (error) {
    console.error('Erreur lors de la création de la conversation', error);
  }
};

const toggleUserSelection = (user: User) => {
  // Ajoutez ou supprimez un utilisateur de la liste sélectionnée
  const index = selectedUsersIds.value.findIndex((selectedUser) => selectedUser._id === user._id);
  if (index === -1) {
    selectedUsersIds.value.push(user);
  } else {
    selectedUsersIds.value.splice(index, 1);
  }
};

const navigateToConversation = (conversationId: string) => {
  // Naviguez vers la conversation avec l'ID spécifié
  router.push(`/conversation/${conversationId}`);
};

const userClass = (user: User) => {
  // Ajoutez une classe spécifique pour indiquer si l'utilisateur est sélectionné
  return twMerge(
      'cursor-pointer hover:bg-gray-200 p-2 rounded',
      selectedUsersIds.value.some((selectedUser) => selectedUser._id === user._id) && 'bg-blue-200'
  );
};
</script>
