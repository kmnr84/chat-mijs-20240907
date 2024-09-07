<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const hasError = ref(false);

const schema = z.object({
  userName: z.string().min(1, 'Must be at least 1 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters')
});

type Schema = z.output<typeof schema>;

const state = reactive({
  userName: undefined,
  email: undefined,
  password: undefined
});

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  await useAuthentication()
    .createUser(e.data.email, e.data.password)
    .then(id => useFirestore().createUser(id, e.data.userName, e.data.email))
    .catch(() => hasError.value = true);
};
</script>

<template>
  <div class="w-80 px-4 mx-auto">
    <div class="h-28"></div>
    <div class="mb-4 text-center">
      <h1 class="text-2xl">CHAT-MIJS2024</h1>
    </div>
    <div v-if="hasError" class="mb-4">
      <UAlert
        color="red"
        variant="soft"
        description="Sign up failure."
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
        @close="() => hasError = false"
         />
    </div>
    <UCard>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>
        <UFormGroup label="User name" name="username">
          <UInput v-model="state.userName" />
        </UFormGroup>
        <UButton block type="submit">Sign up</UButton>
      </UForm>
    </UCard>
    <div class="mt-4 text-center">
      <p>Already have an account?</p>
      <ULink
        to="/login"
        active-class="text-primary"
        inactive-class="text-gray-500"
      >Sign in</ULink>
    </div>
  </div>
</template>
