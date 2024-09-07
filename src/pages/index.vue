<script setup lang="ts">
import type { Message, User } from '~/composables/types/firestore';

const firestore = useFirestore();
const users = ref(new Map<string, User>());
const messages = ref(new Map<string, Message>());
const messageText = ref('');
const currentUser = useCurrentUser();

// current user
const self = computed(() => {
  return users.value.get(currentUser.id.value);
});

const chat = ref<HTMLDivElement>();
const chatInput = ref();

onMounted(() => {
  firestore.listenMessages(messages.value);
  firestore.listenUsers(users.value);
});

watch(() => messages.value.size, () => {
  setTimeout(() => {
    if (chat.value) chat.value.scrollTop = chat.value.scrollHeight;
  }, 500);
});

defineShortcuts({
  ctrl_enter: {
    usingInput: true,
    handler: () => clickSend()
  }
});

// sign out
const clickSignOut = async () => await firestore.signOut();

// send chat message
const clickSend = async () => {
  if (messageText.value.trim() === '') return;

  await firestore.SendContent(messageText.value)
    .then(() => {
      messageText.value = '';
      console.log(chatInput.value);
      chatInput.value?.input.focus();
    });
};

const getImage = (id: string) => {
  return users.value.get(id)?.profile_picture;
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="flex justify-between items-center p-4">
      <div>
        <h1 class="text-2xl">CHAT-MIJS2024</h1>
      </div>
      <div>
        <UPopover>
          <UAvatar :src="self?.profile_picture" :alt="self?.username" />
          <template #panel>
            <div class="p-4">
              <div class="mb-4">{{ self?.username }}</div>
              <div v-if="$pwa?.needRefresh">
                <span>New content available, click on reload button to update.</span>
                <UButton @click="$pwa.updateServiceWorker()">Reload</UButton>
              </div>
              <UButton block v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" variant="link" @click="$pwa.install()">Install PWA</UButton>
              <UButton block variant="link" @click="clickSignOut">Sign out</UButton>
            </div>
          </template>
        </UPopover>
      </div>
    </header>
    <div class="flex flex-col flex-1 max-w-3xl w-full mx-auto overflow-y-hidden">
      <div ref="chat" class="px-3 flex-1 overflow-y-scroll">
        <div v-for="[id, message] in messages" class="flex py-2">
          <div class="pt-2 pr-2">
            <UAvatar :src="getImage(message.sender_id)" :alt="message.sender_name" />
          </div>
          <div>
            <div class="flex items-end">
              <div class="text-lg mr-3">{{ message.sender_name }}</div>
              <div class="text-sm">{{ message.timestamp?.toDate().toLocaleString() }}</div>
            </div>
            <div>{{ message.content }}</div>
          </div>
        </div>
      </div>
      <div class="p-3">
        <UButtonGroup class="flex">
          <UInput ref="chatInput" v-model="messageText" class="flex-1" />
          <UButton icon="i-heroicons-pencil-square" color="gray" @click="clickSend">
            <UKbd>Ctrl</UKbd><UKbd>Enter</UKbd>
          </UButton>
        </UButtonGroup>
      </div>
    </div>
  </div>
</template>
