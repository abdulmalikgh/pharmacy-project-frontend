<template>
  <VaForm ref="passwordForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Forgot your password?</h1>
    <p class="text-base mb-4 leading-5">
      If you've forgotten your password, don't worry. Simply enter your email
      address below, and we'll send you an email with a temporary password.
      Restoring access to your account has never been easier.
    </p>
    <VaInput
      v-model="email"
      :rules="[(v) => !!v || 'Email field is required']"
      class="mb-4"
      label="Enter your email"
      type="email"
    />
    <VaButton class="w-full mb-2" @click="submit">
      <span v-if="loading">Loading...</span>
      <span v-else>Send password</span>
    </VaButton>
    <VaButton
      :to="{ name: 'login' }"
      class="w-full"
      preset="secondary"
      @click="submit"
      >Go back</VaButton
    >
  </VaForm>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useForm } from "vuestic-ui";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const email = ref("");
const form = useForm("passwordForm");
const loading = ref(false);
const router = useRouter();

const authStore = useAuthStore();
const submit = async () => {
  loading.value = true;
  try {
    const res: any = await authStore.resetPassword({ email: email.value });
    if (res) {
      router.push({ name: "recover-password-email" });
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};
</script>
