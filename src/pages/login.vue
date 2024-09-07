<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const hasError = ref(false);

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters')
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined
});

const onSubmit = async (e: FormSubmitEvent<Schema>) => {
  await useFirestore()
    .signIn(e.data.email, e.data.password)
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
        description="Incorrect email or password."
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
        <UButton block type="submit">Sign in</UButton>
      </UForm>
    </UCard>
    <div class="mt-4 text-center">
      <ULink
        to="/signup"
        active-class="text-primary"
        inactive-class="text-gray-500"
      >create an account</ULink>
    </div>
  </div>
</template>
