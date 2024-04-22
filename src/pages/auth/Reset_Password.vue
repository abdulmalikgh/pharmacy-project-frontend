<template>
  <VaForm ref="passwordForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Reset Password</h1>
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="
          isPasswordVisible.value = !isPasswordVisible.value
        "
      >
        <template #appendInner>
          <VaIcon
            :name="
              isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'
            "
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.confirm_password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Confirm Password"
        @clickAppendInner.stop="
          isPasswordVisible.value = !isPasswordVisible.value
        "
      >
        <template #appendInner>
          <VaIcon
            :name="
              isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'
            "
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>
    <VaButton class="w-full mb-2" @click="submit">
      <span v-if="loading">Loading...</span>
      <span v-else>Reset password</span>
    </VaButton>
  </VaForm>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { validators } from "../../services/utils";
import { useForm, useToast } from "vuestic-ui";

const { validate } = useForm("passwordForm");
const { sendResetPassword } = useAuthStore();
const { push, currentRoute } = useRouter();
const { init } = useToast();

const loading = ref(false);
const formData: any = ref({
  password: "",
  confirm_password: "",
});

const submit = async () => {
  if (validate()) {
    loading.value = true;
    try {
      const res: any = await sendResetPassword({
        password: formData.value.password,
        token: currentRoute.value.query.token,
      });
      if (res) {
        init({
          message: "Password reset successfully",
          color: "success",
        });
        push({ name: "login" });
      }
      loading.value = false;
    } catch (error: any) {
      init({
        message: error.data.message,
        color: "danger",
      });
      push({ name: "recover-password" });
      loading.value = false;
    }
  }
};
</script>
